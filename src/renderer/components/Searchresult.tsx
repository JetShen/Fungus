import { ResultSearch, Song } from "util/type";
import 'bootstrap-icons/font/bootstrap-icons.css'; 


export default function Searchresult(props: any){
    return (
        <>
            <div className="ResultContainer">
                <h1 className="tittle"><strong>Result For: </strong> {props.result.query }</h1>
                <div className="ResultBox">
                    {Array.isArray(props.result.list) && props.result.list.map((music: Song, index: any) => {
                        return (
                            <div className="ResultSong" key={index}>
                                <img className="ResultImg" src={music.img} alt="img"/>
                                <div className="innerDiv">
                                    <h3 className="ResultName">{music.name}</h3>
                                    <p className="ResultArtist">{music.artist}</p>
                                </div>
                                {/* Music chart like soundcloud */}
                                <div className="buttonDiv">
                                    <span className="ResultPlay">
                                        <i className="bi bi-play-fill"></i>
                                    </span>
                                    <span className="options">
                                        <i className="bi bi-three-dots"></i>
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}