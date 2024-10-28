// Path: components/SongList/SongList.tsx
import { FC, useState } from 'react';
import { Song, Playlist } from '@/types/MusicTypes';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SongItem } from './SongItem';

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  playlists: Playlist[];
  onSongSelect: (song: Song) => void;
  onAddToPlaylist: (song: Song, playlistId: number) => void;
}

export const SongList: FC<SongListProps> = ({
  songs,
  currentSong,
  playlists,
  onSongSelect,
  onAddToPlaylist
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            <SongItem
              key={song.id}
              song={song}
              isCurrentSong={song.id === currentSong?.id}
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