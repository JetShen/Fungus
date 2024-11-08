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


export const List: FC<SongListProps> = ({
  songs,
  currentSong,
  playlists,
  onSongSelect,
  onAddToPlaylist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [VideoResults, setVideoResults] = useState<Song[]>([]);

  async function searchVideos(query: string) {
    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    const videos = data.Videos.map((video: any, index:number) => ({
      id: 1,
      title: video.title,
      artist: video.channel.name,
      url: video.link
    }));
    setVideoResults(videos);
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
          {VideoResults.map((song) => (
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