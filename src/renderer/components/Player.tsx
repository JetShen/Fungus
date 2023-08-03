import { Song } from "util/type";
import { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Player({currentSong}: {currentSong: Song}){
    const [play, setPlay] = useState(false);

    return (
        <>
        <div className="playercontainer">
            <div className="songImg">
                <img src={currentSong.img} alt="songImg" />
            </div>
            <div className="songName">
                <strong>{currentSong.name}</strong>
                <p>{currentSong.artist}</p>
            </div>
            <div className="divbutton">
                <i className="bi bi-shuffle"></i>
                <i className="bi bi-arrow-left"></i>
                <i className={`bi bi-${play ? 'play' : 'stop'}-circle`}></i>
                <i className="bi bi-arrow-right"></i>
                <i className="bi bi-repeat"></i>
            </div>
            <div className="barmusic">
                <input type="range" name="" id="" />
            </div>
            <div className="vol">
                <i className="bi bi-volume-off"></i>
                <input type="range" name="" id="" />
            </div>
        </div>
        </>
    );
}