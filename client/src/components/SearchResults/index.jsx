import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { useNavigate, Link } from 'react-router-dom';

function SearchResults() {
    const [state] = useStoreContext();
    const { searchResults } = state;
    const products = state.currentCategory == 'all' ? searchResults : searchResults.filter(p => p.category.name === state.currentCategory);

    return (
        <div className='container-fluid mt-3 text-white'>
            <div className="jcsb" style={{"--gap":'15px'}}>
                {products.length ? products.map((r,i) => (
                    <div key={`cat-div-${i}`} className="tac" style={{"--grid-w":'5', "--hover-scale":'1.05'}} >
                        <Link to={`/products/${r._id}`}>
                            <div className='p-2 bg-d2 rounded'>
                                <div className="img-div bg-l1">
                                    <img alt={r.name} src={r.image} />
                                </div>
                                <p className='m-0'>{r.name}</p>
                                <p className='m-0'>{r.category.name}</p>
                                <div>
                                    <span>${r.price}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )) : <div className="tac">No results found</div>}
            </div>
        </div>
    );
}

export default SearchResults;