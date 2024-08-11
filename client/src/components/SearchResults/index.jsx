import React from 'react';
import { useStoreContext } from '../../utils/GlobalState';
import { useNavigate, Link } from 'react-router-dom';

function SearchResults() {
    const [state] = useStoreContext();
    const { searchResults } = state;
    const products = state.currentCategory == '' ? searchResults : searchResults.filter(p => p.category.name === state.currentCategory);

    // console.log('searchResults', searchResults)
    // console.log('currentCategory', state.currentCategory)
    // console.log('products', products);

    return (
        <div className='container-fluid mt-3 text-white'>
            <div className="row row-gap-4 jcsb" 
                // style={{"--gap":'15px'}}
                >
                {products.length ? products.map((r,i) => (
                    <div key={`cat-div-${i}`} className="col-6 col-sm-4 col-md-3 col-lg-2 tac" 
                        style={{"--maxw":'270px', "--hover-scale":'1.05'}} 
                    >
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