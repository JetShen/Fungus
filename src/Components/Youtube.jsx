import React, { useState } from "react";

function Youtube(prop) {
	const [url, setUrlString] = useState('')
	const [title, setTitle] = useState('')


	const handleSubmit = (e) => {
		e.preventDefault();
		prop.setUrl({
			id: prop.list.length,
			soundURL: e.target.variable.value,
			title: e.target.title.value,
    });
	};


	function handleUrl(event){
		setUrlString(event.target.value)
	}

	function handleTitle(event){
		setTitle(event.target.value)
	}

	return (
	<>
		<form onSubmit={handleSubmit}>
			<p>Songs</p>
			<input type="text" placeholder="Ingresar Link" name="variable" onChange={handleUrl}></input>
			<input type="text" placeholder="Ingresar Titulo" name="title" onChange={handleTitle}></input>
			<br />
			<button>Submit</button>
		</form>
		<button onClick={() =>prop.createList(
			{	
				id: prop.list.length,
				soundURL: url,
				title: title
			}
		)}>add Playlist</button>
	</>
);}

export default Youtube;
