// SearchBar component

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { updateSearchResults } from '../../utils/actions';
import { QUERY_PRODUCTS_BY_SEARCH_TERM } from '../../utils/queries';

function SearchBar() {
    const [inputValue, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { loading, data, error } = useQuery(QUERY_PRODUCTS_BY_SEARCH_TERM, {
        variables: { searchTerm: searchQuery },
        skip: !searchQuery
    });

    const [state, dispatch] = useStoreContext();

    useEffect(() => {
        if (loading) { console.log('Loading...')
        } else if (error) { console.error('Error:', error)
        } else if (data) {
            console.log('Data:', data)
            dispatch(updateSearchResults(data.products))
        }
    }, [loading, data, error, dispatch])

    const handleSearch = () => { setSearchQuery(inputValue) };
    const handleKeyDown = (e) => { if (e.key === 'Enter') { handleSearch() } };

    return (
        <div>
            <h2>Search Products</h2>
            <input type="text" value={inputValue} placeholder="Enter search term"
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

export default SearchBar;