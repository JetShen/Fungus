import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Playlist from './components/Playlist';
import Searchbar from './components/Searchbar';
import Searchresult from './components/Searchresult';
import Player from './components/Player';
import Lyrics from './components/Lyrics';
import { ResultSearch, Folder, Song } from 'util/type';

import './App.css';

function Main() {
  const [result, setResult] = useState<ResultSearch>({query: '', list: []});
  const [currentSong,  setCurrentSong] = useState<Song>({name: '', artist: '', img: '', url:'', cod: 0});
  const [toggleList, setToggleList] = useState<boolean>(true);
  const [folder, setFolder] = useState<Folder>({name: '', list: [], cod: 0, color: ''});
  const playlistRef = useRef<HTMLDivElement>(null);

  return (
    <>
      
      <div className="container">
        <div className="search">
          <Searchbar setResult={setResult} setCurrentSong={setCurrentSong} />
        </div>
        <div className="playlist">
          <Playlist folders={folder} playlistRef={playlistRef} setCurrentSong={setCurrentSong} toggleList={toggleList} setToggleList={setToggleList} />
        </div>
        <div className="resultado">
          <Searchresult result={result} toggleList={toggleList} setCurrentSong={setCurrentSong} />
        </div>
        <div className="lyrics">
          <Lyrics currentSong={currentSong}/>
        </div>
        <div className="player">
          <Player currentSong={currentSong}/>
        </div>
      </div>
      
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
