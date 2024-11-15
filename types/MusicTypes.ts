// Path: types/MusicTypes.ts
export interface Song {
    id: number;
    title: string;
    artist: string;
    url: string;
}

export interface Playlist {
    id: number;
    name: string;
    song_ids: number[];
}

export interface MusicAppSettings {
    playlistid: number;
    songid: number;
    volume: number;
    repeat: boolean;
    shuffle: boolean;
}

export interface MusicAppData {
    songs: Song[];
    playlists: Playlist[];
    settings: MusicAppSettings;
}
