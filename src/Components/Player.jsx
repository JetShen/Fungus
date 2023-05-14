import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { writerH, readerH } from "../Scripts/listjs";

function Player(prop) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumen, setVolumen] = useState(1);
  const [prgss, setPrgss] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(null);
  const playerRef = useRef(null);
  const [shuffle, setShuffle] = useState(false);
  const [history, setHistory] = useState([]);
  const [index, setIndex] = useState(0)

  useEffect(() => {
    readerH((err, list) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
      } else {
        setHistory(list);
      }
    });
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };
  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleRandom = () => {
    let song;
    song = history.pop();
  };

  const handleProgres = (e) => {
    setPrgss(e.playedSeconds);
  };
  const handleDuration = (e) => {
    setDuration(e);
  };

  useEffect(() => {
    if (seekTime !== null) {
      setPrgss(seekTime);
      playerRef.current.seekTo(seekTime);
      setSeekTime(null);
    }
  }, [seekTime]);

  function setWriUrl(history, song) {
    setHistory([...history, song]);
    writerH([...history, song]);
    prop.setUrl(song);
  }


  const handlePlaylist = (index) => {
    let song;
    let shuffleN;
    if(index>=prop.list.length || index<0){index = 0; setIndex(index);}
    if(shuffle){
      shuffleN= Math.floor(Math.random() * prop.list.length);
      song = prop.list[shuffleN]
      if (typeof song !== "undefined") {
        if(history.length>14){history.shift();}
        setWriUrl(history,song)
        ;}
    }else{
      song = prop.list[index]
        if (typeof song !== "undefined") {
          if(history.length>14){history.shift();}
          setWriUrl(history,song)
          ;}
    };
    setIndex(index)
  };


  return (
    <>
      <ReactPlayer
        
        url={prop.Url_call.soundURL}
        playing={isPlaying}
        width={200}
        height={200}
        volume={volumen}
        onProgress={handleProgres}
        onDuration={handleDuration}
        ref={playerRef}
        onEnded={() => handlePlaylist(index+1)}
      />
      <p>{prop.Url_call.title}</p>
      {shuffle ? (
        <button onClick={() => handleRandom()}>← on</button>
      ) : (
        <button onClick={() => handlePlaylist(index -1)}>←</button>
      )}

      {isPlaying ? (
        <button onClick={handleStop}>Stop</button>
      ) : (
        <button onClick={handlePlay}>Play</button>
      )}

      <button onClick={() => handlePlaylist(index + 1)}>→</button>

      {shuffle ? (
        <button onClick={() => setShuffle(false)}>Off Shuffle</button>
      ) : (
        <button onClick={() => setShuffle(true)}>On Shuffle</button>
      )}

      <input
        type="range"
        min="0.0"
        max="1.0"
        step="0.01"
        value={volumen}
        onChange={(e) => setVolumen(parseFloat(e.target.value))}
      />
      <input
        type="range"
        min="0"
        max={duration}
        value={seekTime !== null ? seekTime : prgss}
        step="1"
        onChange={(e) => setSeekTime(parseFloat(e.target.value))}
      />
    </>
  );
}

export default Player;
