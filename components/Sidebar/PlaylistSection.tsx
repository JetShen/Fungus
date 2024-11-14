// Path: components/Sidebar/PlaylistSection.tsx
import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, FolderPlus } from 'lucide-react';
import { Playlist } from '@/types/MusicTypes';

interface PlaylistSectionProps {
  playlists: Playlist[];
  currentPlaylist: Playlist;
  onPlaylistSelect: (playlist: Playlist) => void;
  onImportSongs: () => void;
  onCreatePlaylist: (name: string) => void;
}

export const PlaylistSection: FC<PlaylistSectionProps> = ({
  playlists,
  currentPlaylist,
  onPlaylistSelect,
  onImportSongs,
  onCreatePlaylist
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName);
      setNewPlaylistName('');
    }
  };

  return (
    <div className="w-64 border-r border-border flex flex-col">
      <div className="p-2">
        <h2 className="text-xl font-bold mb-4">Playlists</h2>
        <Button
          variant="outline"
          size="sm"
          className="w-full mb-2"
          onClick={onImportSongs}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          Import Songs
        </Button>
        <div className="flex mb-2 items-center">
          <Input
            type="text"
            placeholder="New playlist"
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
              className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded ${
                currentPlaylist.id === playlist.id ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => onPlaylistSelect(playlist)}
            >
              {playlist.name}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
