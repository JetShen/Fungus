import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Searchbar(props: any){
    function callSearch(e:any){
        e.preventDefault();
        let url = e.target[0].value;
        console.log(url);

        let result = {
            name: 'Cancion',
            artist: 'Artista',
            img: 'https://i.pinimg.com/1200x/85/85/65/8585659b3ebaeced8adacb35b90e0da8.jpg',
            url: url,
            cod: 0,
        }
        props.setCurrentSong(result);
        //setResult(search); [{},{},{},...,{} -> 10]
    }


    return (
        <>
        <nav className='searchnav'>
            <form onSubmit={callSearch} className="Searchbar">
                <input className="SearchbarInput" type="text" placeholder="Search" />
                <button className="SearchbarButton" type="submit">
                    <i className="bi bi-search"></i>
                </button>
            </form>
        </nav>
        </>
    );
}