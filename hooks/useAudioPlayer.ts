import { useRef, useState, useEffect } from 'react';
import { MusicAppData, Playlist, Song } from '@/types/MusicTypes';

export function useAudioPlayer(initialSong: Song) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState<Song>(initialSong);
    const currentSongRef = useRef<Song>(initialSong);
    const isTransitioning = useRef(false);

    useEffect(() => {
        currentSongRef.current = currentSong;
    }, [currentSong]);

    const getData = (): MusicAppData => {
        const data = localStorage.getItem('data');
        return data ? JSON.parse(data) : {} as MusicAppData;
    };

    const setupAudioListeners = (audio: HTMLAudioElement) => {
        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
        });

        audio.addEventListener('ended', async () => {
            if (!isTransitioning.current) {
                isTransitioning.current = true;
                await handleSongEnd();
                isTransitioning.current = false;
            }
        });

        audio.addEventListener('play', () => {
            setIsPlaying(true);
        });

        audio.addEventListener('pause', () => {
            setIsPlaying(false);
        });
    };

    useEffect(() => {
        if (!audioRef.current) {
            const audio = new Audio();
            setupAudioListeners(audio);
            audioRef.current = audio;
            setAudioSource(initialSong);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    const handleSkip = async (direction: 'forward' | 'backward') => {
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
        
        if (nextSong) {
            MusicData.settings.songid = nextSongId;
            localStorage.setItem('data', JSON.stringify(MusicData));
            await setAudioSource(nextSong, true);
        }
    };
    
    const handleSongEnd = async () => {
        const MusicData = getData();
        if (MusicData.settings.repeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            try {
                await audioRef.current.play();
            } catch (error) {
                console.error("Repeat playback failed:", error);
            }
        } else {
            await handleSkip('forward');
        }
    };

    const handleTimeUpdate = (newTime: number[]) => {
        if (audioRef.current && newTime[0] !== undefined) {
            audioRef.current.currentTime = newTime[0];
            setCurrentTime(newTime[0]);
        }
    };

    const handlePlayPause = async () => {
        if (audioRef.current) {
            try {
                if (isPlaying) {
                    audioRef.current.pause();
                } else {
                    await audioRef.current.play();
                }
            } catch (error) {
                console.error("Playback control failed:", error);
            }
        }
    };

    const setAudioSource = async (song: Song, autoplay = false) => {
        if (!audioRef.current) return;
        
        const MusicData = getData();
        audioRef.current.volume = MusicData.settings.volume;
        
        try {
            const invoke = await import('@tauri-apps/api').then((api) => api.invoke);
            const sourceType = getSourceType(song.url);
            let sourceUrl = '';

            if (sourceType === 'youtube') {
                sourceUrl = await invoke('getm3u8', { url: song.url });
            } else if (sourceType === 'soundcloud') {
                sourceUrl = await invoke('getsoundcloud', { url: song.url });
            } else {
                sourceUrl = song.url;
            }

            if (sourceUrl) {
                const wasPlaying = isPlaying || autoplay;
                audioRef.current.src = sourceUrl;
                setCurrentTime(0);
                setDuration(0);
                setCurrentSong(song);

                if (wasPlaying) {
                    try {
                        await audioRef.current.play();
                    } catch (error) {
                        console.error("Auto-playback failed:", error);
                    }
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