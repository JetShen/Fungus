// Path: lib/musicDataService.ts
import { MusicAppData } from '@/types/MusicTypes';

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
        },
        {
            "id": 4,
            "title": "Song 4",
            "artist": "Artist 4",
            "url": "https://soundcloud.com/frxgxd/1553470665499594756a",
        }
    ],
    "playlists": [
        {
            "id": 1,
            "name": "All Songs",
            "song_ids": [1, 2, 3, 4],
        }
    ],
    settings: {
        last_active_play_list_id: 1,
        last_played_song_id: 1,
        volume: 1,
        repeat: false,
        shuffle: false
    }
};

export async function loadMusicData(): Promise<MusicAppData> {
    const documentDir = await import('@tauri-apps/api/path').then(api => api.documentDir);
    const localdir = await documentDir();
    const jsonFilePath = `${localdir}/music-data.json`;
    const invoke = await import('@tauri-apps/api').then(api => api.invoke);
    try {
        
        const data = await invoke('load', { filedir: jsonFilePath });
        if (data) {
            return data as MusicAppData;
        }
    } catch (error) {
        console.error("Error loading music data:", error);
    }

    try {
        await invoke('save', { filedir: jsonFilePath, data: FixedMusicData });
    } catch (error) {
        console.error("Error saving music data:", error);
    }

    return FixedMusicData;
}

export async function saveMusicData(data: MusicAppData) {
    const documentDir = await import('@tauri-apps/api/path').then(api => api.documentDir);
    const localdir = await documentDir();
    const jsonFilePath = `${localdir}/music-data.json`;
    const invoke = await import('@tauri-apps/api').then(api => api.invoke);
    try {
        await invoke('save', { filedir: jsonFilePath, data });
    } catch (error) {
        console.error("Error saving music data:", error);
    }
}
