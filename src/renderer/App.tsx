import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
//import { useState, useEffect, useRef } from 'react';
import Playlist from './components/Playlist';
import Searchbar from './components/Searchbar';
import Searchresult from './components/Searchresult';
import Player from './components/Player';
import Lyrics from './components/Lyrics';


type Song = {
  name: string;
  artist: string;
  img: string;
  cod: number;
};

type Folder = {
  name: string;
  list: Song[];
  cod: number;
};


const list = [
  {
    name: 'song1',
    artist: 'GoodKid',
    img:'../../assets/img/cover.jpg',
    cod: 1
  },
  {
    name: 'song2',
    artist: 'GoodKid',
    img:'../../assets/img/cover.jpg',
    cod: 2
  },
  {
    name: 'song3',
    artist: 'GoodKid',
    img:'../../assets/img/cover.jpg',
    cod: 3
  }
];

const folder = [
  {
    name: 'folder1',
    list: list,
    cod: 1
  },
  {
    name: 'folder2',
    list: list,
    cod: 2
  },
  {
    name: 'folder3',
    list: list,
    cod: 3
  },
]


function Main() {
  return (
    <>
      <Playlist folders={folder}/>
      <Searchbar />
      <Searchresult />
      <Player />
      <Lyrics />
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
