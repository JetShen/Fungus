import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Playlist from './components/Playlist';
import Searchbar from './components/Searchbar';
import Searchresult from './components/Searchresult';
import Player from './components/Player';
import Lyrics from './components/Lyrics';
import { ResultSearch, Song } from 'util/type';

import './App.css';

const initialResult = {
  query: '',
  list: []
}

// Test data
const list = [
  {
    name: 'song1',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 1
  },
  {
    name: 'song2',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 2
  },
  {
    name: 'song3',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 3
  },
  {
    name: 'song4',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 4
  },
  {
    name: 'song5',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 5
  },
  {
    name: 'song6',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 6
  },
  {
    name: 'song7',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 7
  },
  {
    name: 'song8',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 8
  },
  {
    name: 'song9',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 9
  },
  {
    name: 'song10',
    artist: 'GoodKid',
    img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
    cod: 10
  },

];

const folder = [
  {
    name: 'folder1',
    list: list,
    cod: 1,
    color: 'red'
  },
  {
    name: 'folder2',
    list: list,
    cod: 2,
    color: 'blue'
  },
  {
    name: 'folder3',
    list: list,
    cod: 3,
    color: 'green'
  },
]


function Main() {
  const [result, setResult] = useState<ResultSearch>(initialResult);
  const [currentSong,  setCurrentSong] = useState<Song>({name: '', artist: '', img: '', cod: 0});
  const [toggleList, setToggleList] = useState<boolean>(true);
  const playlistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentSong({
      name: 'song3',
      artist: 'GoodKid',
      img:'https://yt3.googleusercontent.com/YRIStaj6O_NZPJ9ub0URx59SgLhQJVCkSMa_NgRMiEaHxNoLF3jaIej6-1IgRSf0r1ciGUK9Vw=s900-c-k-c0x00ffffff-no-rj',
      cod: 3
    });
    setResult({
      query: 'Good Kid',
      list: list
    })
  }
  , []);

  return (
    <>
      
      <div className="container">
        <div className="search">
          <Searchbar setResult={setResult} />
        </div>
        <div className="playlist">
          <Playlist folders={folder} playlistRef={playlistRef} setCurrentSong={setCurrentSong} toggleList={toggleList} setToggleList={setToggleList} />
        </div>
        {/* <div className="resultado">
          <Searchresult result={result} toggleList={toggleList} setCurrentSong={setCurrentSong} />
        </div>
        <div className="lyrics">
          <Lyrics />
        </div>
        <div className="player">
          <Player currentSong={currentSong}/>
        </div> */}
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
