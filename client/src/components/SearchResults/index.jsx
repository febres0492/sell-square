import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { Link } from 'react-router-dom';
import { QUERY_ALL_PRODUCTS } from '../../utils/queries';
import { updateSearchResults } from '../../utils/actions';

function SearchResults() {
    const [state, dispatch] = useStoreContext();
    const { searchResults } = state;

    const { loading, data, error } = useQuery(QUERY_ALL_PRODUCTS);

    useEffect(() => {
        if (loading) {
            console.log('Loading...');
        } else if (error) {
            console.error('Error:', error);
        } else if (data) {
            dispatch(updateSearchResults(data.products));
        }
    }, [loading, data, error, dispatch]);

    return (<>
    
        <h3>Search Results:</h3>
        <div className="d-flex flex-wrap">
            {searchResults.map((r) => (
                <div className="card px-1 py-1" key={r._id}>
                    <Link to={`/products/${r._id}`}>
                        <img alt={r.name} src={`/images/${r.image}`} />
                        <p>{r.name}</p>
                    </Link>
                    <div>
                        <span>${r.price}</span>
                    </div>
                    <button onClick={() => console.log('Buy button clicked')}>Buy</button>
                </div>
            ))}
        </div>
    </>);
}

export default SearchResults;