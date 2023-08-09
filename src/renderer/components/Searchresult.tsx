import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { motion } from "framer-motion"
import { Video } from "scrape-youtube";
import React, { useState, useEffect } from "react"; // Importa useState y useEffect

export default function Searchresult(props: any) {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        // Cada vez que el componente se cargue o props.result cambie, actualiza el estado para reiniciar la animación
        setAnimationKey(animationKey + 1);
    }, [props.result]);

    function playSong(music: Video) {
        props.setCurrentSong(music);
    }

    return (
        <>
            <div className="ResultContainer">
                <p className="tittle"><strong>Result For: </strong> {props.result.query}</p>
                <div className="ResultBox">
                    {Array.isArray(props.result.list) && props.result.list.map((music: Video, index: any) => {
                        return (
                            <motion.div
                                key={`animation-${animationKey}-${index}`} // Utiliza una clave única para cada elemento mapeado
                                initial={{
                                    opacity: 0,
                                    y: -50,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: index * 0.2,
                                }}
                                className="ResultSong">
                                <img className="ResultImg" src={music.thumbnail} alt="img" />
                                <p className="musicname"><strong>{music.title}</strong> {music.channel.name}</p>
                                
                                <div id="play">
                                    <i className="bi bi-play-fill" onClick={() => { playSong(music) }}></i>
                                </div>
                                <div id="options"> 
                                    <i className="bi bi-three-dots"></i>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
