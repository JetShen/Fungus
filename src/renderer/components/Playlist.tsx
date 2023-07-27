

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


export default function Playlist({folders}: {folders: Folder[]}){
    return (
        <>
        <h1>Playlist</h1>
        {Array.isArray(folders) && folders.map((folder: Folder, index) => {
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
            )}
        </>
    );
}