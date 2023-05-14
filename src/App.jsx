import { useState, useEffect } from 'react'
import Youtube from "./Components/Youtube";
import Player from "./Components/Player";
import PlayList from './Components/PlayList';
import { writer, reader } from './Scripts/listjs';
import { leer } from './makeplaylist';
var isDev = require('isDev')

if(isDev) {
  console.log("In Development!")
} else {
  console.log("Not in Development!")
}

function App() {
  const [playlist, setPlaylist] = useState([])
  const [URL, setUrl] = useState({})
  const [name, setName] = useState("")
  const testFolder = './public/json'
  //crear un for x para leer todos los archivos {LW+<NombreDeLista>.json} e insertarlos
  useEffect(() => {
    leer(testFolder,setName);
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

  function Delet(deleted){
    const filter = playlist.filter( Element => Element.id !=deleted.id)
    setPlaylist(filter)
    writer(filter)
  }

  console.log("Nombre: ",name)
  return (
    <div className="App">
      <Player list={playlist} setUrl={setUrl} Url_call={URL}/>
      <Youtube setUrl={setUrl} createList={createList} list={playlist}/>
      <PlayList list={playlist} setUrl={setUrl} Delet={Delet} />
    </div>
  )
}

export default App
