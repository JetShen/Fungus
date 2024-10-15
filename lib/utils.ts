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
}

export interface Playlist {
  id: number;
  name: string;
  songs: Song[];
}


export interface Playlists {
  playlists: Playlist[];
}