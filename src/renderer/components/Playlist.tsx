import { Key } from "react";
import { Folder, Song } from "util/type";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion"


export default function Playlist(props: any){
  const [erasedText, setErasedText] = useState('PlayList');
  const innerRef = useRef<HTMLDivElement>(null);
  const [isOpenList, setIsOpenList] = useState<boolean[]>([]); 


  useEffect(() => {
    const newIsOpenList = props.folders.map(() => false);
    setIsOpenList(newIsOpenList);
  }, [props.folders]);

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


  const toggle = () => {
      props.setToggleList(!props.toggleList);
      if(props.toggleList){
          removeLetters('PlayList');
      } else{
          addLetters('PlayList');
      }
  }

  const handleToggle = (index: any) => {
    setIsOpenList((prevIsOpenList: any[]) =>
      prevIsOpenList.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

    // {props.toggleList ? 
    //   <i className="bi bi-door-open" onClick={toggle}></i>
    //       : 
      
    //   <i className="bi bi-door-closed" ></i>
    // }

  return (
    <>
      <motion.div
      initial={{
        width: '100%'
      }}
      animate={{
        width: props.toggleList ? '100%' : '40%' 
      }}
      transition={{
        duration: 1,
      }}
      
      className="playlistcontainer">
        <div className="box">
              <button className="buttonlist">
                  <motion.i
                  initial={{
                    left: '0.5em'
                  }}
                  animate={{
                    left: props.toggleList ? '0.5em' : '0.1em'
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className={`bi bi-door-${props.toggleList ? 'open' : 'closed'} buttonlist`}
                  onClick={toggle}
                />
              </button>
              <motion.h3 
              // initial={{
              //   left: '50%'
              // }}
              // animate={{
              //   left: props.toggleList ? '6%' : '3%'
              // }}
              transition={{
                duration: 1,
              }}
              className="playlistTitle">{erasedText}</motion.h3>
        </div>
        <div ref={innerRef} className="innerPlaylist">
          {Array.isArray(props.folders) && props.folders.map((folder: Folder, index: number) => (
            <div className="outFolder" key={index}>
              <div
              className="Folder">
                <motion.i
                  initial={{
                    rotate: 0,
                  }}
                  animate={{
                    rotate: isOpenList[index] ? 90 : 0,
                    opacity: props.toggleList ? 1 : 0,
                  }}
                  
                  transition={{
                    duration: 0.6,
                  }}

                  className="bi bi-caret-right"
                  onClick={() => handleToggle(index)}
                ></motion.i>
                <motion.div
                  style={{
                    backgroundColor: folder.color,
                  }}
                  initial={{
                    transform: 'skewX(0deg)',
                    
                  }}
                  animate={{
                    transform: isOpenList[index] ? 'skewX(20deg)' : 'skewX(0deg)',
                    left: props.toggleList ? 0 : -12,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className="folderName"
                >
                  <h2 className="PlaylistFolderName">{props.toggleList ? folder.name :  folder.name.slice(0, 1) }</h2>
                </motion.div>
              </div>
              <motion.div
              className="music">
                {Array.isArray(folder.list) && folder.list.map((music: Song, musicIndex: number) => (
                  <motion.h3
                    initial={{
                      margin: '-1.15em',
                    }}
                    animate={{
                      margin: isOpenList[index] ? '0em' : '-1.15em',
                      opacity: isOpenList[index] ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.9,
                    }}
                  className="musicName" key={musicIndex}>
                    {music.name} - {music.artist}
                    <span className="options">
                      <i className="bi bi-three-dots"></i>
                    </span>
                  </motion.h3>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}