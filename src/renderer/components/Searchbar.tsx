import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Searchbar(props: any){

    async function callSearch(e: any) {
        e.preventDefault();
        let query = e.target[0].value;
        try {
            let resultado = await window.search.fetchYT(query).then((res: Array<[]>) => {
                return res
            });
            props.setResult({query: query, list: resultado});
        } catch (error) {
            console.error('Error:', error);
        }
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