import { Key } from "react";
import { Folder, Song } from "util/type";
import { useRef, useEffect, useState } from "react";

export default function Playlist(props: any){
    const [erasedText, setErasedText] = useState('PlayList');


    async function removeLetters(inputString: string): Promise<string> {
        if (inputString.length < 8) {
          return inputString; // No se pueden eliminar letras si la cadena tiene menos de 8 caracteres
        }
      
        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
        let result = inputString.slice(0, 3) + inputString.slice(4, 7);
        await wait(290);
        setErasedText(result);
        result = inputString.slice(0, 2) + inputString.slice(4, 6);
        await wait(290);
        setErasedText(result);
        result = inputString.slice(0, 1) + inputString.slice(4, 5);
        await wait(290);
        setErasedText(result);
        return result;
    }

    const playlistToggleStyle = {
        width: props.toggleList ? '20vw' : '6vw',
    }
    const titleerased = {
        left: props.toggleList ? '2em' : '1em',
    }

    const toggle = () => {
        props.setToggleList(!props.toggleList);
        removeLetters(erasedText);
    }

    return (
        <>
        <div ref={props.playlistRef} style={{ ...playlistToggleStyle }} className="playlistcontainer">
            <div className="box">
                <button className="buttonlist">
                    {props.toggleList ? 
                        <i className="bi bi-door-open" onClick={toggle}></i>
                            : 
                        
                        <i className="bi bi-door-closed" onClick={toggle}></i>
                    }
                </button>
                <h1 className="playlistTitle" style={titleerased}>{erasedText}</h1>
            </div>
            <div className="innerPlaylist">
                {/* {Array.isArray(props.folders) && props.folders.map((folder: Folder, index: Key | null | undefined) => {
                    return (
                        <div className="Folder" key={index}>
                            <h2 className="PlaylistFolderName">{folder.name}</h2>
                            {Array.isArray(folder.list) && folder.list.map((music: Song, index) => {
                                return (
                                    <div key={index}>
                                        <img className="PlaylistImg" src={music.img} alt="img"/>
                                        <h3 className="PlaylistName">{music.name}</h3>
                                        <p className="PlaylistArtist">{music.artist}</p>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
                )} */}
            </div>
        </div>
        </>
    );
}