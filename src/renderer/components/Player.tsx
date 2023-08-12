import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { Video } from "scrape-youtube";


export default function CombinedPlayer({ currentSong }: { currentSong: Video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumen, setVolumen] = useState(1);
  const [prgss, setPrgss] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);
  const playerRef = useRef<ReactPlayer>(null); 
  const [shuffle, setShuffle] = useState(false);
  const [m3, setM3] = useState('');

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleRandom = () => {
    // add random function, wait for the playlist to be done
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
    setSeekTime(newSeekTime);
  };

  const handleVolumeChange = (e: { target: { value: string; }; }) => {
    const newVolume = parseFloat(e.target.value);
    setVolumen(newVolume);
  };

  useEffect(() => {
    if (seekTime !== null && playerRef.current) {
      playerRef.current.seekTo(seekTime);
      setSeekTime(null);
    }
  }, [seekTime]);

  useEffect(()=>{
    const obtenerM3 = async () => {
      if(currentSong.title !== undefined){
        const url = await window.m3u8.getm3u8_url(currentSong.link).then((res: any) => {
          console.log("res", res)
          return res
        })
        setM3(url)
      }
    }
    obtenerM3()
  }, [currentSong])

  return (
    <div className="playercontainer">
      <div className="songImg">
        <img src={currentSong.thumbnail} alt="" />
      </div>
      <div className="songName">
        <strong>{currentSong.channel? currentSong.title : "Unknown Song"}</strong>
        <p>{String(currentSong.channel? currentSong.channel.name : "Unknown Artist")}</p>
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
        url={m3}
        playing={isPlaying}
        width={0}
        height={0}
        volume={volumen}
        onProgress={handleProgres}
        onDuration={handleDuration}
        ref={playerRef}
        attributes={{
          file: {
          'allow-cross-origin': true
          }
        }}
      />
    </div>
  );
}
