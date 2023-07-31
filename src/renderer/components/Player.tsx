import { Song } from "util/type";

export default function Player({currentSong}: {currentSong: Song}){
    return (
        <>
        <div className="Player">
            <img className="PlayerImg" src={currentSong.img}></img>
            <p className="PlayerName">{currentSong.name}</p>
            <p className="PlayerArtist">{currentSong.artist}</p>
            <button className="PlayerShuffle"></button>
            <button className="PlayerBack"></button>
            <button className="PlayerPlay"></button>
            <button className="PlayerNext"></button>
            <button className="PlayerLoop"></button>
        </div>
        </>
    );
}