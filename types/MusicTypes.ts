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
    last_active_play_list_id: number;
    last_played_song_id: number;
    volume: number;
    repeat: boolean;
    shuffle: boolean;
}

export interface MusicAppData {
    songs: Song[];
    playlists: Playlist[];
    settings: MusicAppSettings;
}
