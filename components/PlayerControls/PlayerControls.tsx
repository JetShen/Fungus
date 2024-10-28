// Path: components/PlayerControls/PlayerControls.tsx
import { FC } from 'react';
import { Song } from '@/types/MusicTypes';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Repeat } from 'lucide-react';

interface PlayerControlsProps {
    currentSong: Song | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    shuffle: boolean;
    repeat: boolean;
    onPlayPause: () => void;
    onSkip: (direction: 'forward' | 'backward') => void;
    onSeek: (time: number[]) => void;
    onVolumeChange: (volume: number[]) => void;
    onShuffleToggle: () => void;
    onRepeatToggle: () => void;
    onSongEnd: () => void;
}

export const PlayerControls: FC<PlayerControlsProps> = ({
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    onPlayPause,
    onSkip,
    onSeek,
    onVolumeChange,
    onShuffleToggle,
    onRepeatToggle,
    onSongEnd
}) => {
    return (
        <div className="h-24 border-t border-border bg-background">
            <div className="container mx-auto h-full flex items-center justify-between px-4">
                <div className="w-1/3">
                    <h2 className="text-lg font-semibold">{currentSong?.title || "No song selected"}</h2>
                    <p className="text-sm text-muted-foreground">{currentSong?.artist || "Unknown artist"}</p>
                </div>
                <div className="w-1/3 flex flex-col items-center">
                    <div className="flex items-center space-x-4 mb-2">
                        <Button variant="outline" size="icon" onClick={() => onSkip('backward')}>
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="default" size="icon" onClick={onPlayPause}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => onSkip('forward')}>
                            <SkipForward className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="w-full flex items-center space-x-2">
                        <span className="text-sm">{formatTime(currentTime)}</span>
                        <Slider
                            value={[currentTime]}
                            max={duration}
                            step={1}
                            onValueChange={onSeek}
                            className="w-full"
                            onEnded={onSongEnd}
                        />
                        <span className="text-sm">{formatTime(duration)}</span>
                    </div>
                </div>
                <div className="w-1/3 flex justify-end items-center space-x-4">
                    <Button
                        variant={shuffle ? "default" : "outline"}
                        size="sm"
                        onClick={onShuffleToggle}
                    >
                        <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={repeat ? "default" : "outline"}
                        size="sm"
                        onClick={onRepeatToggle}
                    >
                        <Repeat className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4" />
                        <Slider
                            value={[volume]}
                            max={1}
                            step={0.01}
                            onValueChange={onVolumeChange}
                            className="w-24"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}