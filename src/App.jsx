import { useState, useEffect } from 'react'
import Youtube from "./Components/Youtube";
import Player from "./Components/Player";
import PlayList from './Components/PlayList';
import { writer, reader } from './Scripts/listjs';


console.log('[App.tsx]', `Hello world from Electron ${process.versions.electron}!`)

function App() {
  const [playlist, setPlaylist] = useState([])
  const [URL, setUrl] = useState({})

  useEffect(() => {
    reader((err, list) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
      } else {
        setPlaylist(list);
      }
    });
  }, []);


  function createList(song){
    setPlaylist([...playlist, song])
    writer([...playlist, song])
  }



  return (
    <div className="App">
      <Player list={playlist} setUrl={setUrl} Url_call={URL}/>
      <Youtube setUrl={setUrl} createList={createList} list={playlist}/>
      <PlayList list={playlist} setUrl={setUrl} />
    </div>
  )
}

export default App
