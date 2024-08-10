import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { Link } from 'react-router-dom';
import { QUERY_ALL_PRODUCTS } from '../../utils/queries';
import { updateSearchResults } from '../../utils/actions';
import updateState from '../../utils/updateState';

function SearchResults() {
    const [state, dispatch] = useStoreContext();
    const { searchResults } = state;
    // console.log('SearchResults:', searchResults);

    // const { loading, data, error } = useQuery(QUERY_ALL_PRODUCTS);

    // useEffect(() => {
    //     if (data) {
    //         dispatch(updateSearchResults(data.products));
    //     }
    // }, [loading, data, error, dispatch]);

    // const { loading, data } = updateState('products');
    // console.log('products:', data);

    // console.log('SearchResults:', data);

    return (
        <div className='container-fluid mt-3'>
            <div className="d-flex flex-wrap gap-4">
                {searchResults.map((r) => (
                    <Link to={`/products/${r._id}`}>
                        <div className="card p-2 tac bg-d4 text-white gap-2" key={r._id}>
                            <div className="img-div bg-l1 rounded">
                                <img alt={r.name} src={r.image} />
                            </div>
                            <p className='m-0'>{r.name}</p>
                        
                            <div>
                                <span>${r.price}</span>
                            </div>
                            <button className="btn-1 bg-c1" onClick={() => console.log('Buy button clicked')}>Learn More</button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SearchResults;