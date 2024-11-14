// Path: hooks/useAudioPlayer.ts
import { useRef, useState, useEffect } from 'react';
import { Song } from '@/types/MusicTypes';

export function useAudioPlayer(initialSong: Song) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSong, setCurrentSong] = useState<Song>(initialSong);

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
        console.log("Setting audio source:", song);
        
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
        setIsPlaying
    };
}

type SourceType = 'local' | 'youtube' | 'soundcloud';

const getSourceType = (url: string): SourceType => {
    if (url.includes('youtube')) return 'youtube';
    if (url.includes('soundcloud')) return 'soundcloud';
    return 'local';
};