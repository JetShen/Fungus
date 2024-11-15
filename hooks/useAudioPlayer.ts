import { useRef, useState, useEffect } from 'react';
import { MusicAppData, Playlist, Song } from '@/types/MusicTypes';
import { saveMusicData } from '@/lib/musicDataService';

export function useAudioPlayer(initialSong: Song) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState<Song>(initialSong);
    
    // Create a ref to hold the latest song data to avoid stale closures
    const currentSongRef = useRef<Song>(initialSong);

    useEffect(() => {
        currentSongRef.current = currentSong;
    }, [currentSong]);

    const getData = (): MusicAppData => {
        const data = localStorage.getItem('data');
        return data ? JSON.parse(data) : {} as MusicAppData;
    };

    // Create audio element when hook is first used
    useEffect(() => {
        if (!audioRef.current) {
            const audio = new Audio();
            audio.addEventListener('timeupdate', () => {
                setCurrentTime(audio.currentTime);
            });
            audio.addEventListener('loadedmetadata', () => {
                setDuration(audio.duration);
            });
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                handleSongEnd();
            });
            audioRef.current = audio;
        }

        // Set initial song
        setAudioSource(initialSong);

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    const handleSkip = (direction: 'forward' | 'backward') => {
        const MusicData = getData();
        if (!audioRef.current || !currentSongRef.current) return;
        
        const currentPlaylist = MusicData.playlists.find(
            (playlist: Playlist) => playlist.id === MusicData.settings.playlistid
        );
        
        if (!currentPlaylist) return;
        
        const currentIndex = currentPlaylist.song_ids.findIndex(
            songId => songId === currentSongRef.current.id
        );
        
        if (currentIndex === -1) return;
        
        let nextIndex: number;
        
        if (MusicData.settings.shuffle) {
            do {
                nextIndex = Math.floor(Math.random() * currentPlaylist.song_ids.length);
            } while (nextIndex === currentIndex && currentPlaylist.song_ids.length > 1);
        } else {
            if (direction === 'forward') {
                nextIndex = (currentIndex + 1) % currentPlaylist.song_ids.length;
            } else {
                nextIndex = (currentIndex - 1 + currentPlaylist.song_ids.length) % currentPlaylist.song_ids.length;
            }
        }
        
        const nextSongId = currentPlaylist.song_ids[nextIndex];
        const nextSong = MusicData.songs.find(song => song.id === nextSongId);
        
        if (!nextSong) return;
        
        MusicData.settings.songid = nextSongId;
        localStorage.setItem('data', JSON.stringify(MusicData));
        saveMusicData(MusicData);
        setAudioSource(nextSong);
        setIsPlaying(true);
    };
    
    const handleSongEnd = () => {
        const MusicData = getData();
        if (MusicData.settings.repeat) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(error => console.error("Playback failed:", error));
            }
        } else {
            handleSkip('forward');
        }
    };

    const handleTimeUpdate = (newTime: number[]) => {
        if (audioRef.current && newTime[0] !== undefined) {
            audioRef.current.currentTime = newTime[0];
            setCurrentTime(newTime[0]);
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error("Playback failed:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const setAudioSource = async (song: Song) => {
        if (!audioRef.current) return;

        const invoke = await import('@tauri-apps/api').then((api) => api.invoke);
        try {
            const sourceType = getSourceType(song.url);
            if (sourceType === 'youtube') {
                const urlM3U8: string = await invoke('getm3u8', { url: song.url });
                if (urlM3U8) {
                    audioRef.current.src = urlM3U8;
                }
            } else if (sourceType === 'soundcloud') {
                const urlSC: string = await invoke('getsoundcloud', { url: song.url });
                if (urlSC) {
                    audioRef.current.src = urlSC;
                }
            } else {
                audioRef.current.src = song.url;
            }

            // Reset state for new song
            setCurrentTime(0);
            setDuration(0);
            setCurrentSong(song);

            if (isPlaying) {
                try {
                    await audioRef.current.play();
                } catch (error) {
                    console.error("Playback failed:", error);
                    setIsPlaying(false);
                }
            }
        } catch (error) {
            console.error("Error setting audio source:", error);
        }
    };

    return {
        currentSong,
        audioRef,
        isPlaying,
        currentTime,
        duration,
        handleTimeUpdate,
        handlePlayPause,
        setAudioSource,
        setIsPlaying,
        handleSkip,
        handleSongEnd
    };
}

type SourceType = 'local' | 'youtube' | 'soundcloud';

const getSourceType = (url: string): SourceType => {
    if (url.includes('youtube')) return 'youtube';
    if (url.includes('soundcloud')) return 'soundcloud';
    return 'local';
};