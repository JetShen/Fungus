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
    }
  ],
  "playlists": [
    {
      "id": 1,
      "name": "All Songs",
      "song_ids": [1, 2, 3],
    }
  ],
  settings: {
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
  console.log(localdir); 
  const jsonFilePath = `${localdir}/music-data.json`;

  try {
    const data = await invoke.invoke('load', { filedir: jsonFilePath });
    console.log(data);
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
function MusicPlayer({MusicData}: {MusicData: MusicAppData}): JSX.Element {
  const [allSongs, setAllSongs] = useState<Song[]>(MusicData.songs);
  const [playlists, setPlaylists] = useState<Playlist[]>(MusicData.playlists);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(MusicData.playlists[0]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(MusicData.settings.volume);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { toast } = useToast();


  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Playback failed:", error));
      }
    }
  }, [currentSong]); 

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
    setCurrentSong(allSongs.find(song => song.id === nextSongId) || null);
    setIsPlaying(true);
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

  const handleImportSongs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newSongs: Song[] = Array.from(files).map((file, index) => ({
        id: allSongs.length + index + 1,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        url: URL.createObjectURL(file)
      }));

      setAllSongs([...allSongs, ...newSongs]);
      const newSongsIds = newSongs.map(song => song.id);
      
      setPlaylists(prevPlaylists =>
        prevPlaylists.map(playlist =>
          playlist.name === currentPlaylist.name || playlist.name === "All Songs"
            ? { ...playlist, songIds: [...playlist.song_ids, ...newSongsIds] }
            : playlist
        )
      );
    }
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist: Playlist = {
        id: playlists.length + 1,
        name: newPlaylistName.trim(),
        song_ids: []
      };
      setPlaylists(prevPlaylists => [...prevPlaylists, newPlaylist]);
      setNewPlaylistName('');
    }
  };

  const handleAddToPlaylist = (song: Song, playlistId: number, playlistName: string) => {
    setPlaylists(prevPlaylists =>
      prevPlaylists.map(playlist =>
        playlist.id === playlistId
          ? { ...playlist, songIds: [...playlist.song_ids, song.id] }
          : playlist
      )
    );
    toast(
      {
        title: `Song added to ${playlistName}`,
        description: `Song ${song.title} added to  ${playlistName}`,
      });
  };

  const CurrentListSongs: Song[] = currentPlaylist.song_ids.map(songId => allSongs.find(song => song.id === songId) || null).filter(Boolean) as Song[];

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
              type="file"
              ref={fileInputRef}
              onChange={handleImportSongs}
              className="hidden"
              {...({ webkitdirectory: "true" } as React.InputHTMLAttributes<HTMLInputElement>)}
              multiple
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
                  onClick={() => setCurrentPlaylist(playlist)}
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
              onClick={() => setShuffle(!shuffle)}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant={repeat ? "default" : "outline"}
              size="sm"
              onClick={() => setRepeat(!repeat)}
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