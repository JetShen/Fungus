import { Key } from "react";
import { Folder, Song } from "util/type";
import { useRef, useEffect, useState } from "react";

export default function Playlist(props: any){
    const [erasedText, setErasedText] = useState('PlayList');
    const [toggleFolder, setToggleFolder] = useState(false);
    const songRef = useRef<HTMLDivElement>(null);

    

    async function removeLetters(inputString: string): Promise<string> {
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

    async function addLetters(inputString: string): Promise<string> {
        if(inputString.length < 3){
            return inputString;
        }
      
        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
        let result = inputString.slice(0, 1) + inputString.slice(4, 5);
        await wait(150);
        setErasedText(result);
        result = inputString.slice(0, 2) + inputString.slice(4, 6);
        await wait(150);
        setErasedText(result);
        result = inputString.slice(0, 3) + inputString.slice(4, 7);
        await wait(150);
        setErasedText(result);
        result = inputString.slice(0, 4) + inputString.slice(4, 8);
        await wait(150);
        setErasedText(result);
        return result;
    }

    const playlistToggleStyle = {
        width: props.toggleList ? '100%' : '40%',
    }
    const titleerased = {
        left: props.toggleList ? '6%' : '3%',
    }

    const toggle = () => {
        props.setToggleList(!props.toggleList);
        if(props.toggleList){
            removeLetters('PlayList');
        } else{
            addLetters('PlayList');
        }
    }

    const listStyle = {
        transform: toggleFolder && props.toggleList ? 'skewX(20deg)' : 'skewX(0deg)',
    };
    
    const folderbutton = {
        transform: toggleFolder && props.toggleList ? 'rotate(90deg)' : 'rotate(0deg)',
    };

    const songName = {
        top: props.toggleList ? (toggleFolder ? '0' : '-10em') : '-10em',
    };

    const musicFolder = {
        height: props.toggleList ? (toggleFolder ? '100%' : '0') : '0'
    };

    const clickfolder = () => {
        setToggleFolder(!toggleFolder);
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
                <div className="outFolder">
                    <div className="Folder">
                        <i className="bi bi-caret-right" onClick={clickfolder} style={folderbutton}></i>
                        <div className="folderName" style={listStyle}> 
                        </div>
                        <h2 className="PlaylistFolderName">Folder</h2>
                    </div>
                    <div className="music" style={musicFolder}>
                        <h3 ref={songRef} className="musicName" style={songName}>Redbone - Come and Get Your</h3>
                        <h3 ref={songRef} className="musicName" style={songName}>Redbone - Come and Get Your</h3>
                        <h3 ref={songRef} className="musicName" style={songName}>Redbone - Come and Get Your</h3>
                        <h3 ref={songRef} className="musicName" style={songName}>Redbone - Come and Get Your</h3>
                    </div>
                </div>
                
                
                
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