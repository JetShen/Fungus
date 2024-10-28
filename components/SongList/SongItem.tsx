// Path: components/SongList/SongItem.tsx
import React, { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Playlist, Song } from '@/types/MusicTypes';


interface SongItemProps {
    song: Song;
    isCurrentSong: boolean;
    playlists: Playlist[];
    onSelect: (song: Song) => void;
    onAddToPlaylist: (song: Song, playlistId: number) => void;
}

export const SongItem: FC<SongItemProps> = ({
    song,
    isCurrentSong,
    playlists,
    onSelect,
    onAddToPlaylist
}) => {
    return (
        <div
            className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded flex justify-between items-center ${isCurrentSong
                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                    : ''
                }`}
        >
            <div
                className={`flex-1 ${isCurrentSong ? 'text-primary-foreground' : ''
                    }`}
                onClick={()=>onSelect(song)}
            >
                <h3 className="font-medium">{song.title}</h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {isCurrentSong ? (
                        <Button variant="blackBorder" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Playlist
                        </Button>
                    ) : (
                        <Button variant="whiteBorder" size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Playlist
                        </Button>
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {playlists.map((playlist) => (
                        <DropdownMenuItem
                            key={playlist.id}
                            onSelect={() => onAddToPlaylist(song, playlist.id)}
                        >
                            {playlist.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

