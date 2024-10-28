// path: app/page.tsx
"use client"

import { Toaster } from '@/components/ui/toaster';
import { useState, useEffect } from 'react';
import { loadMusicData, saveMusicData } from '@/lib/musicDataService';
import { MusicAppData, Playlist, Song } from '@/types/MusicTypes';
import { PlaylistSection } from '@/components/Sidebar/PlaylistSection';
import { SongList } from '@/components/SongList/SongList';
import { PlayerControls } from '@/components/PlayerControls/PlayerControls';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useToast } from '@/components/ui/use-toast';
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';

export default function Home() {
  const [musicData, setMusicData] = useState<MusicAppData | null>(null);

  useEffect(() => {
    loadMusicData().then(data => setMusicData(data));
  }, []);

  if (!musicData) return null;

  return (
    <div className="container mx-auto">
      <MusicPlayer MusicData={musicData} setMusicData={setMusicData} />
      <Toaster />
    </div>
  );
}

function MusicPlayer({ MusicData, setMusicData }: { MusicData: MusicAppData, setMusicData: (data: MusicAppData) => void }) {
  const [currentPlaylist, setCurrentPlaylist] = useState(MusicData.playlists[0]);
  const [isImporting, setIsImporting] = useState(false);
  const [shuffle, setShuffle] = useState(MusicData.settings.shuffle);
  const [repeat, setRepeat] = useState(MusicData.settings.repeat);
  const { currentSong, audioRef, isPlaying, currentTime, duration, handleTimeUpdate, handlePlayPause, setAudioSource, setIsPlaying } = useAudioPlayer(MusicData.songs.find(song => song.id === MusicData.settings.last_played_song_id) || MusicData.songs[0]);
  const [volume, setVolume] = useState(MusicData.settings.volume);
  const { toast } = useToast();

  const handlePlaylistSelect = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    toast({
      title: `Playlist "${playlist.name}" selected`,
      description: `Playing ${playlist.song_ids.length} songs`,
    });
  };

  const handleImportSongs = async () => {
    const result = await open({
      multiple: true,
      filters: [{ name: 'Music Files', extensions: ['mp3', 'wav', 'flac', 'm4a', 'webm'] }]
    });
    if (!result || !Array.isArray(result)) {
      return;
    }
    const lastSongId = Math.max(...MusicData.songs.map(song => song.id), 0);
    setIsImporting(true);
    const songs = await Promise.all(result.map(async (file, index) => {
      return {
        id: lastSongId + index + 1,
        title: extractFileName(file),
        artist: "Unknown Artist",
        url: convertFileSrc(file)
      };
    }));

    const updatedMusicData = {
      ...MusicData,
      songs: [...MusicData.songs, ...songs],
      playlists: MusicData.playlists.map(playlist => {
        if (playlist.id === 1 || playlist.id === currentPlaylist.id) {
          return {
            ...playlist,
            song_ids: [...playlist.song_ids, ...songs.map(song => song.id)]
          };
        }
        return playlist;
      })
    };
    setMusicData(updatedMusicData);
    Object.assign(MusicData, updatedMusicData);
    await saveMusicData(updatedMusicData);
    setIsImporting(false);
    toast({
      title: "Songs imported",
      description: `${songs.length} songs added to "Imported Songs" playlist`,
    })
  };

  const handleCreatePlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: MusicData.playlists.length + 1,
      name: name.trim(),
      song_ids: []
    };

    const updatedData = {
      ...MusicData,
      playlists: [...MusicData.playlists, newPlaylist]
    };
    setMusicData(updatedData);
    saveMusicData(updatedData);
    toast({
      title: "Playlist created",
      description: `New playlist "${name}" created`,
    });
  };

  const handleSkip = (direction: 'forward' | 'backward') => {
    if (!audioRef.current) return;
    if (!currentSong) return;

    const currentIndex = currentPlaylist.song_ids.findIndex(songId => songId === currentSong.id);
    if (currentIndex === -1) return;

    let nextIndex: number;

    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * currentPlaylist.song_ids.length);
      } while (nextIndex === currentIndex && currentPlaylist.song_ids.length > 1);
    } else {
      if (direction === 'forward') {
        nextIndex = (currentIndex + 1) % currentPlaylist.song_ids.length;
      } else {
        nextIndex = (currentIndex - 1 + currentPlaylist.song_ids.length) % currentPlaylist.song_ids.length;
      }
    }

    const nextSongId = currentPlaylist.song_ids[nextIndex];
    const proximaCancion = MusicData.songs.find(song => song.id === nextSongId);
    if (!proximaCancion) return;
    setAudioSource(proximaCancion);
    MusicData.settings.last_played_song_id = nextSongId;
    setIsPlaying(true);
    saveMusicData(MusicData);
  };


  const handleVolumeChange = (newValue: number[]) => {
    const newVolume = newValue[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    MusicData.settings.volume = newVolume;
    saveMusicData(MusicData);
  };

  const handleSongEnd = () => {
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => console.error("Playback failed:", error));
      }
    } else {
      handleSkip('forward');
    }
  };

  const handleAddToPlaylist = (song: Song, playlistId: number) => {
    const targetPlaylist = MusicData.playlists.find(playlist => playlist.id === playlistId);

    if (!targetPlaylist) {
      toast({
        title: "Error",
        description: "Playlist not found",
        variant: "destructive"
      });
      return;
    }

    if (targetPlaylist.song_ids.includes(song.id)) {
      toast({
        title: "Already exists",
        description: `${song.title} is already in ${targetPlaylist.name}`,
        variant: "destructive"
      });
      return;
    }

    MusicData.playlists = MusicData.playlists.map(playlist =>
      playlist.id === targetPlaylist.id
        ? { ...playlist, song_ids: [...playlist.song_ids, song.id] }
        : playlist
    );

    saveMusicData(MusicData);

    toast({
      title: `Song added to ${targetPlaylist.name}`,
      description: `${song.title} added to ${targetPlaylist.name}`,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <PlaylistSection
          playlists={MusicData.playlists}
          currentPlaylist={currentPlaylist}
          onPlaylistSelect={handlePlaylistSelect}
          onImportSongs={handleImportSongs}
          onCreatePlaylist={handleCreatePlaylist}
        />
        <SongList
          songs={MusicData.songs.filter(song => currentPlaylist.song_ids.includes(song.id))}
          currentSong={currentSong}
          onSongSelect={setAudioSource}
          onAddToPlaylist={handleAddToPlaylist}
          playlists={MusicData.playlists}
        />
      </div>
      <PlayerControls
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          shuffle={shuffle}
          repeat={repeat}
          onPlayPause={handlePlayPause}
          onSkip={handleSkip}
          onSeek={handleTimeUpdate}
          onVolumeChange={handleVolumeChange}
          onShuffleToggle={() => setShuffle(prev => !prev)}
          onRepeatToggle={() => setRepeat(prev => !prev)}
          onSongEnd={handleSongEnd}
        />
    </div>
  );
}

function extractFileName(filePath: string): string {
  return filePath.split(/[/\\]/).pop()?.replace(/\.[^/.]+$/, "") ?? 'Unknown Title';
}