"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat, Plus, FolderPlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Song, Playlist, MusicAppData } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { open } from '@tauri-apps/api/dialog';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { invoke } from '@tauri-apps/api';

const FixedMusicData: MusicAppData = {
  "songs": [
    {
      "id": 1,
      "title": "Song 1",
      "artist": "Artist 1",
      "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      "id": 2,
      "title": "Song 2",
      "artist": "Artist 2",
      "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      "id": 3,
      "title": "Song 3",
      "artist": "Artist 3",
      "url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    {
      "id": 4,
      "title": "Disconnected",
      "artist": "Artist 4",
      "url": "https://www.youtube.com/watch?v=MwSkC85TDgY"
    }
  ],
  "playlists": [
    {
      "id": 1,
      "name": "All Songs",
      "song_ids": [1, 2, 3, 4],
    }
  ],
  settings: {
    last_active_play_list_id: 1,
    last_played_song_id: 1,
    volume: 1,
    repeat: false,
    shuffle: false
  }
};



async function LoadMusicData(): Promise<MusicAppData> {
  const invoke = await import('@tauri-apps/api');
  const appDataDir = await import('@tauri-apps/api/path');
  const localdir = await appDataDir.documentDir();
  const jsonFilePath = `${localdir}/music-data.json`;

  try {
    const data = await invoke.invoke('load', { filedir: jsonFilePath });
    if (data) {
      return data as MusicAppData;
    }
  } catch (error) {
    console.error("Error loading music data:", error);
  }

  try {
    await invoke.invoke('save', { filedir: jsonFilePath, data: FixedMusicData });
  } catch (error) {
    console.error("Error saving music data:", error);
  }

  return FixedMusicData;
}

async function saveMusicData(data: MusicAppData) {
  const invoke = await import('@tauri-apps/api');
  const appDataDir = await import('@tauri-apps/api/path');
  const localdir = await appDataDir.documentDir();
  const jsonFilePath = `${localdir}/music-data.json`;

  try {
    await invoke.invoke('save', { filedir: jsonFilePath, data });
  } catch (error) {
    console.error("Error saving music data:", error);
  }
}



export default function MusicPlayerApp() {
  const [musicData, setMusicData] = useState<MusicAppData | null>(null);

  useEffect(() => {
    console.log("Loading music data...");

    LoadMusicData().then(data => setMusicData(data));
  }, []);

  if (!musicData) return null;

  return (
    <MusicPlayer MusicData={musicData} />
  );
}



/**
 * MusicPlayer component provides a full-featured music player interface.
 * 
 * @param {Object} props - The component props.
 * @param {MusicAppData} props.MusicData - The initial data for the music player, including songs, playlists, and settings.
 * 
 * @returns {JSX.Element} The rendered MusicPlayer component.
 * 
 * @component
 * 
 * @example
 * const musicData = {
 *   songs: [{ id: 1, title: 'Song 1', artist: 'Artist 1', url: 'url1' }],
 *   playlists: [{ id: 1, name: 'Playlist 1', song_ids: [1] }],
 *   settings: { volume: 0.5 }
 * };
 * 
 * <MusicPlayer MusicData={musicData} />
 * 
 * @typedef {Object} MusicAppData
 * @property {Song[]} songs - The list of songs available in the music player.
 * @property {Playlist[]} playlists - The list of playlists available in the music player.
 * @property {Object} settings - The settings for the music player.
 * @property {number} settings.volume - The initial volume setting for the music player.
 * 
 * @typedef {Object} Song
 * @property {number} id - The unique identifier for the song.
 * @property {string} title - The title of the song.
 * @property {string} artist - The artist of the song.
 * @property {string} url - The URL of the song file.
 * 
 * @typedef {Object} Playlist
 * @property {number} id - The unique identifier for the playlist.
 * @property {string} name - The name of the playlist.
 * @property {number[]} song_ids - The list of song IDs included in the playlist.
 */
function MusicPlayer({ MusicData }: { MusicData: MusicAppData }): JSX.Element {
  const [playlists, setPlaylists] = useState<Playlist[]>(MusicData.playlists);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(MusicData.playlists[MusicData.settings.last_active_play_list_id || 0]);
  const [currentSong, setCurrentSong] = useState<Song | null>(MusicData.songs.find(song => song.id === MusicData.settings.last_played_song_id) || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(MusicData.settings.volume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [shuffle, setShuffle] = useState(MusicData.settings.shuffle);
  const [repeat, setRepeat] = useState(MusicData.settings.repeat);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { toast } = useToast();


  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const setAudioSource = async () => {
      try {
        if (isYouTubeUrl(currentSong.url)) {
          await handleYouTubeUrl(currentSong.url);
        } else {
          setLocalFileSource(currentSong.url);
        }

        if (isPlaying && audioRef.current) {
          await audioRef.current.play();
        }
      } catch (error) {
        console.error("Playback failed:", error);
      } finally {
        MusicData.settings.last_played_song_id = currentSong.id || 1;
        saveMusicData(MusicData);
      }
    };

    setAudioSource();
  }, [currentSong]);

  const isYouTubeUrl = (url: string) => url.includes('youtube');

  const handleYouTubeUrl = async (url: string) => {
    const invoke = await import('@tauri-apps/api');
    try {
      const urlM3U8: string = await invoke.invoke('getm3u8', { url });
      if (urlM3U8 && audioRef.current) {
        audioRef.current.src = urlM3U8;
      }
    } catch (error) {
      console.error("Error fetching m3u8 URL:", error);
    }
  };

  const setLocalFileSource = (url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url;
    }
  };


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (direction: 'forward' | 'backward') => {
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
    setCurrentSong(MusicData.songs.find(song => song.id === nextSongId) || null);
    MusicData.settings.last_played_song_id = nextSongId;
    setIsPlaying(true);
    saveMusicData(MusicData);
  };


  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (newValue: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue[0];
      setCurrentTime(newValue[0]);
    }
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

  const handleImportSongs = async () => {
    try {
      const selectedFiles = await open({
        multiple: true,
        filters: [{ name: 'Music Files', extensions: ['mp3', 'wav', 'flac', 'm4a', 'webm'] }]
      });

      if (!selectedFiles || !Array.isArray(selectedFiles)) {
        return;
      }

      const lastSongId = Math.max(...MusicData.songs.map(song => song.id), 0);
      const newSongs = selectedFiles.map((filePath, index) => ({
        id: lastSongId + index + 1,
        title: extractFileName(filePath),
        artist: "Unknown Artist",
        url: convertFileSrc(filePath)
      }));

      const updatedMusicData = {
        ...MusicData,
        songs: [...MusicData.songs, ...newSongs],
        playlists: MusicData.playlists.map(playlist => {
          if (playlist.id === 1 || playlist.id === currentPlaylist.id) {
            return {
              ...playlist,
              song_ids: [...playlist.song_ids, ...newSongs.map(song => song.id)]
            };
          }
          return playlist;
        })
      };

      setPlaylists(prevPlaylists =>
        prevPlaylists.map(playlist =>
          (playlist.id === 1 || playlist.id === currentPlaylist.id)
            ? { ...playlist, song_ids: [...playlist.song_ids, ...newSongs.map(song => song.id)] }
            : playlist
        )
      );

      Object.assign(MusicData, updatedMusicData);
      await saveMusicData(MusicData);

      toast({
        title: "Songs imported",
        description: `Successfully imported ${newSongs.length} songs`
      });

    } catch (error) {
      console.error("Error importing songs:", error);
      toast({
        title: "Import failed",
        description: "Failed to import songs. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: playlists.length + 1,
        name: newPlaylistName.trim(),
        song_ids: []
      };
      MusicData.playlists.push(newPlaylist);
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      saveMusicData(MusicData);
    }
  };

  const handleAddToPlaylist = (song: Song, playlistId: number, playlistName: string) => {
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
        description: `${song.title} is already in ${playlistName}`,
        variant: "destructive"
      });
      return;
    }

    MusicData.playlists = MusicData.playlists.map(playlist =>
      playlist.id === playlistId
        ? { ...playlist, song_ids: [...playlist.song_ids, song.id] }
        : playlist
    );

    saveMusicData(MusicData);

    setPlaylists(prevPlaylists =>
      prevPlaylists.map(playlist =>
        playlist.id === playlistId
          ? { ...playlist, song_ids: [...playlist.song_ids, song.id] }
          : playlist
      )
    );

    toast({
      title: `Song added to ${playlistName}`,
      description: `${song.title} added to ${playlistName}`,
    });
  };

  const CurrentListSongs: Song[] = currentPlaylist.song_ids.map(songId => MusicData.songs.find(song => song.id === songId) || null).filter(Boolean) as Song[];

  const filteredSongs = CurrentListSongs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border flex flex-col">
          <div className="p-2">
            <h2 className="text-xl font-bold mb-4">Playlists</h2>
            <Button
              variant="outline"
              size="sm"
              className="w-full mb-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              Import Songs
            </Button>
            <input
              type="button"
              ref={fileInputRef}
              onClick={() => handleImportSongs()}
              className="hidden"
            />
            <div className="flex mb-2 items-center">
              <Input
                type="text"
                placeholder="New playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="mr-2"
              />
              <Button variant="outline" size="sm" onClick={handleCreatePlaylist}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 pt-0">
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded ${currentPlaylist.id === playlist.id ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  onClick={() => { setCurrentPlaylist(playlist), MusicData.settings.last_active_play_list_id = playlist.id, saveMusicData(MusicData) }}
                >
                  {playlist.name}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 pb-0">
            <Input
              type="text"
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 pt-0">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded flex justify-between items-center ${song.id === currentSong?.id ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : ''
                    }`}
                >
                  <div
                    className={`flex-1 ${currentSong?.id === song.id ? 'text-primary-foreground' : ''
                      }`}
                    onClick={() => {
                      setCurrentSong(song);
                      setIsPlaying(true);
                    }}
                  >
                    <h3 className="font-medium">{song.title}</h3>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {song.id === currentSong?.id ?
                        <Button variant="blackBorder" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Playlist
                        </Button>
                        :
                        <Button variant="whiteBorder" size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add to Playlist
                        </Button>
                      }
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {playlists.map((playlist) => (
                        <DropdownMenuItem key={playlist.id} onSelect={() => handleAddToPlaylist(song, playlist.id, playlist.name)}>
                          {playlist.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Player Control Bar */}
      <div className="h-24 border-t border-border bg-background">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="w-1/3">
            <h2 className="text-lg font-semibold">{currentSong?.title || "No song selected"}</h2>
            <p className="text-sm text-muted-foreground">{currentSong?.artist || "Unknown artist"}</p>
          </div>
          <div className="w-1/3 flex flex-col items-center">
            <div className="flex items-center space-x-4 mb-2">
              <Button variant="outline" size="icon" onClick={() => handleSkip('backward')}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="default" size="icon" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleSkip('forward')}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full flex items-center space-x-2">
              <span className="text-sm">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
              />
              <span className="text-sm">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="w-1/3 flex justify-end items-center space-x-4">
            <Button
              variant={shuffle ? "default" : "outline"}
              size="sm"
              onClick={() => { MusicData.settings.shuffle = !shuffle, setShuffle(!shuffle), saveMusicData(MusicData) }}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant={repeat ? "default" : "outline"}
              size="sm"
              onClick={() => { MusicData.settings.repeat = !repeat, setRepeat(!repeat), saveMusicData(MusicData) }}
            >
              <Repeat className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
      />
    </div>
  );
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function extractFileName(filePath: string): string {
  return filePath.split(/[/\\]/).pop()?.replace(/\.[^/.]+$/, "") ?? 'Unknown Title';
}