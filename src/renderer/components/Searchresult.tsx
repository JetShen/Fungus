import { Song } from "util/type";
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { motion } from "framer-motion"

export default function Searchresult(props: any){
    return (
        <>
            <div className="ResultContainer">
                <p className="tittle"><strong>Result For: </strong> {props.result.query }</p>
                <div className="ResultBox">
                    {Array.isArray(props.result.list) && props.result.list.map((music: Song, index: any) => {
                        return (
                            <motion.div
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
                            className="ResultSong" key={index}>
                                <img className="ResultImg" src={music.img} alt="img"/>
                                <p className="musicname"><strong>{music.name}</strong> {music.artist}</p>
                                
                                <div id="play">
                                 <i className="bi bi-play-fill" ></i>
                                </div>
                                <div id="options"> 
                                    <i className="bi bi-three-dots" ></i>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}