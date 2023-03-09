import React from 'react'

function PlayList(list_prop) {
    return (
        <div>
            <h1>PlayList</h1>
            {list_prop.list.map(song => (
            <div key={song.id} >
                <p>{song.title}</p>
                <button onClick={() => list_prop.setUrl(song)}>Reproducir</button>
                <button onClick={() => list_prop.Delet(song)}>Delete</button>
            </div>
            ))}
        </div>
    )
}

export default PlayList