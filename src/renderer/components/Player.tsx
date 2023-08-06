import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { Song } from "util/type"; // Asegúrate de importar correctamente el tipo Song


export default function CombinedPlayer({ currentSong }: { currentSong: Song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumen, setVolumen] = useState(1);
  const [prgss, setPrgss] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const playerRef = useRef<ReactPlayer>(null); 
  const [shuffle, setShuffle] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleRandom = () => {
    // Implementa la lógica para reproducir aleatoriamente una canción
  };

  const handleProgres = (e: { playedSeconds: React.SetStateAction<number>; }) => {
    setPrgss(e.playedSeconds);
  };

  const handleDuration = (e: React.SetStateAction<number>) => {
    setDuration(e);
  };

  const handleProgressChange = (e: { target: { value: string; }; }) => {
    const newSeekTime = parseFloat(e.target.value);
    setPrgss(newSeekTime);
    setSeekTime(newSeekTime); // Asignamos el nuevo valor de búsqueda directamente
  };

  const handleVolumeChange = (e: { target: { value: string; }; }) => {
    const newVolume = parseFloat(e.target.value);
    setVolumen(newVolume);
  };

  useEffect(() => {
    if (seekTime !== null && playerRef.current) { // Agrega una verificación de null
      playerRef.current.seekTo(seekTime);
      setSeekTime(null);
    }
  }, [seekTime]);

  return (
    <div className="playercontainer">
      <div className="songImg">
        <img src={currentSong.img} alt="songImg" />
      </div>
      <div className="songName">
        <strong>{currentSong.name}</strong>
        <p>{currentSong.artist}</p>
      </div>
      <div className="divbutton">
        <i className="bi bi-shuffle" onClick={() => setShuffle(!shuffle)}></i>
        <i className="bi bi-arrow-left"></i>
        <i
          className={`bi bi-${isPlaying ? "pause" : "play"}-circle`}
          onClick={isPlaying ? handleStop : handlePlay}
        ></i>
        <i className="bi bi-arrow-right"></i>
        <i className="bi bi-repeat"></i>
      </div>
      <div className="barmusic">
        <input
          type="range"
          name="progress"
          id="progress"
          min="0"
          max={duration}
          value={prgss}
          step="1"
          onChange={handleProgressChange}
        />
      </div>
      <div className="vol">
        <i className="bi bi-volume-off"></i>
        <input
          type="range"
          name="volume"
          id="volume"
          min="0"
          max="1"
          step="0.01"
          value={volumen}
          onChange={handleVolumeChange}
        />
      </div>
      <ReactPlayer
        url={currentSong.url}
        playing={isPlaying}
        width={0}
        height={0}
        volume={volumen}
        onProgress={handleProgres}
        onDuration={handleDuration}
        ref={playerRef}
        config={
          {
            file:{
              forceAudio: true,
              attributes: {
                crossOrigin: true,
              }
            },
            youtube: {
              playerVars: { origin: window.location.origin }
              
            }
          }
        }
      />
    </div>
  );
}
