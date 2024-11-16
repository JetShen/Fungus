// path: app/page.tsx
"use client"

import { Toaster } from '@/components/ui/toaster';
import { useState, useEffect, use } from 'react';
import { loadMusicData, saveMusicData } from '@/lib/musicDataService';
import { MusicAppData, Playlist, Song } from '@/types/MusicTypes';
import { PlaylistSection } from '@/components/Sidebar/PlaylistSection';
import { SongList } from '@/components/SongList/SongList';
import { PlayerControls } from '@/components/PlayerControls/PlayerControls';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useToast } from '@/components/ui/use-toast';
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { List } from '@/components/YouTube/List';
import { Button } from '@/components/ui/button';
import { SoundCloud } from '@/components/SoundCloud/soundcloud';

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
  const { currentSong, audioRef, isPlaying, currentTime, duration, handleTimeUpdate, handlePlayPause, setAudioSource, handleSkip, handleSongEnd } = useAudioPlayer(MusicData.songs.find(song => song.id === MusicData.settings.songid) || MusicData.songs[0]);
  const [volume, setVolume] = useState(MusicData.settings.volume);
  const [switcher, setSwitcher] = useState(1);
  const { toast } = useToast();

  const handlePlaylistSelect = (playlist: Playlist) => {
    if (switcher !== 1) {
      setSwitcher(1);
    }
    setCurrentPlaylist(playlist);
  };

  useEffect(() => { // Save last state of the app
    MusicData.settings.playlistid = currentPlaylist.id;
    MusicData.settings.songid = currentSong.id;
    MusicData.settings.volume = volume;
    MusicData.settings.shuffle = shuffle;
    MusicData.settings.repeat = repeat;
    localStorage.setItem('data', JSON.stringify(MusicData));
    saveMusicData(MusicData);
  }, [currentPlaylist, currentSong, volume, shuffle, repeat, MusicData]);


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
    toast({
      title: "Playlist created",
      description: `New playlist "${name}" created`,
    });
  };



  const handleVolumeChange = (newValue: number[]) => {
      const newVolume = newValue[0];
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
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


    toast({
      title: `Song added to ${targetPlaylist.name}`,
      description: `${song.title} added to ${targetPlaylist.name}`,
    });
  };

  const handleAddSong = (song: Song,  playlistId: number) => {
    const targetPlaylist = MusicData.playlists.find(playlist => playlist.id === playlistId);
    if (!targetPlaylist) {
      toast({
        title: "Error",
        description: "Playlist not found",
        variant: "destructive"
      });
      return;
    }
    const lastId = Math.max(...MusicData.songs.map(song => song.id), 0);
    const newSong = {
      id: lastId + 1,
      title: extractFileName(song.title),
      artist: song.artist,
      url: song.url
    }

    MusicData.songs.push(newSong);

    MusicData.playlists = MusicData.playlists.map(playlist =>
      playlist.id === targetPlaylist.id || playlist.id === 1
        ? { ...playlist, song_ids: [...playlist.song_ids, newSong.id] }
        : playlist
    );


    toast({
      title: `Song added to ${targetPlaylist.name}`,
      description: `${song.title} added to ${targetPlaylist.name}`,
    });
  }

  const SwitchWindow = (id: number) => {
    switch (id) {
      case 1:
        return <SongList
          songs={MusicData.songs.filter(song => currentPlaylist.song_ids.includes(song.id))}
          currentSong={currentSong}
          onSongSelect={setAudioSource}
          onAddToPlaylist={handleAddToPlaylist}
          playlists={MusicData.playlists}
        />;
      case 2:
        return <List
          songs={MusicData.songs.filter(song => currentPlaylist.song_ids.includes(song.id))}
          currentSong={currentSong}
          playlists={MusicData.playlists}
          onSongSelect={setAudioSource}
          onAddToPlaylist={handleAddSong}
        />;
      case 3:
        return <SoundCloud 
          songs={MusicData.songs.filter(song => currentPlaylist.song_ids.includes(song.id))}
          currentSong={currentSong}
          playlists={MusicData.playlists}
          onSongSelect={setAudioSource}
          onAddToPlaylist={handleAddSong}
        />;
      default:
        return null;
    }
  }

  const loopSong = (type: string) => {
    if (type == 'shuffle') {
      setShuffle(prev => !prev)
      MusicData.settings.shuffle = !shuffle;
    } else {
      setRepeat(prev => !prev)
      MusicData.settings.repeat = !repeat;
    }
  }


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
        <div className='flex flex-col flex-1 overflow-hidden w-full'>
          <div className="flex flex-row justify-center  pl-2 pt-1 m-0 ">
            <Button variant={switcher == 1 ? 'selectedRectangle' : 'rectangle'} fullWidth onClick={() => setSwitcher(1)}>Songs</Button>
            <Button variant={switcher == 2 ? 'selectedRectangle' : 'rectangle'} fullWidth onClick={() => setSwitcher(2)}>Youtube</Button>
            <Button variant={switcher == 3 ? 'selectedRectangle' : 'rectangle'} fullWidth onClick={() => setSwitcher(3)}>SoundCloud</Button>
          </div>
          {
            SwitchWindow(switcher)
          }
        </div>
        
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
          onShuffleToggle={() => loopSong('shuffle')}
          onRepeatToggle={() => loopSong('repeat')}
          onSongEnd={handleSongEnd}
        />
    </div>
  );
}

function extractFileName(filePath: string): string {
  return filePath.split(/[/\\]/).pop()?.replace(/\.[^/.]+$/, "") ?? 'Unknown Title';
}

