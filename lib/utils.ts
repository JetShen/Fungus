import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export interface Song {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration?: number;
  album?: string;
  year?: number;
  genre?: string;
}

export interface Playlist {
  id: number;
  name: string;
  song_ids: number[];
  createdAt?: string;
}

export interface Settings {
  theme?: 'light' | 'dark';
  last_active_play_list_id?: number;
  last_played_song_id?: number;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
}

export interface MusicAppData {
  songs: Song[];
  playlists: Playlist[];
  settings: Settings;
}