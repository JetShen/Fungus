// Path: components/SongList/SongList.tsx
import { FC, useEffect, useState } from 'react';
import { Song, Playlist } from '@/types/MusicTypes';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SongItem } from '../SongList/SongItem';
import { Button } from "@/components/ui/button";

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  playlists: Playlist[];
  onSongSelect: (song: Song) => void;
  onAddToPlaylist: (song: Song, playlistId: number) => void;
}


interface SongYT {
  id: string;
  title: string;
  url: string;
  artist: string;
}


export const SoundCloud: FC<SongListProps> = ({
  songs,
  currentSong,
  playlists,
  onSongSelect,
  onAddToPlaylist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [SongsResults, setSongsResults] = useState<Song[]>([]);

  async function searchVideos(query: string) {
    const response = await fetch(`/api/soundcloud?query=${encodeURIComponent(query)}`);
    console.log(response);
    const data = await response.json();
    if (data.error) {
        setSongsResults([]);
        return;
    }
    const songs = data.Songs.map((song: any, index:number) => ({
        id: 1,
        title: song.title,
        artist: song.artist,
        url: song.url
    }));
    setSongsResults(songs);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex p-4 pb-0">
        <Input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Button variant="whiteBorder" size="sm" onClick={() => searchVideos(searchTerm)}>
          Search
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 pt-0">
          {SongsResults.map((song) => (
            <SongItem
              key={song.url}
              song={song}
              isCurrentSong={song.title === currentSong?.title} 
              playlists={playlists}
              onSelect={() => onSongSelect(song)}
              onAddToPlaylist={(song: Song, playlistId: number) => onAddToPlaylist(song, playlistId)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};