import 'bootstrap-icons/font/bootstrap-icons.css';



function callSearch(e:any){
    e.preventDefault();
    let search = e.target[0].value;
    console.log(search);

    //setResult(search); [{},{},{},...,{} -> 10]
}

export default function Searchbar({ setResult }: {setResult: any}){
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