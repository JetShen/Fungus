import {useState, useEffect} from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { motion } from "framer-motion";
function searchLyrics(song: any){
    const lyrics = "Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente Funcionando correctamente"




    return lyrics;
}


export default function Lyrics(currentSong: any){
    const [Lyrics, setLyrics] = useState<string>("");
    

    function findLyrics(currentSong:any){
        setLyrics(searchLyrics(currentSong));
    }

    return (
        <>
        <div className="lyricsbox">
            <p className="Lyrics">Lyrics</p>
            <div className="innerlyricsbox">
                <div className="lyricscontainer">
                {Lyrics.length > 0 ?
                    <p>{Lyrics}</p>
                    :
                <span className="lyricsSearch">
                    <i className="bi bi-search" onClick={() => {findLyrics(currentSong)}}></i>
                </span>
                }
                </div>
            </div>
        </div>
        </>
    );
}