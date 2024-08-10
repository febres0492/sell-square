import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { updateSearchResults } from '../../utils/actions';
import { QUERY_ALL_PRODUCTS, QUERY_PRODUCTS_BY_SEARCH_TERM } from '../../utils/queries';
import updateState from '../../utils/updateState';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchBar() {
    const [inputValue, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { loading, data, error } = useQuery(QUERY_PRODUCTS_BY_SEARCH_TERM, {
        variables: { searchTerm: searchQuery },
        skip: !searchQuery
    });

    updateState('products', data);

    const handleSearch = () => {
        setSearchQuery(inputValue);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSearchQuery('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container-fluid">
            <div className="my-3 df gap-2">
                <input type="text" className="form-control w-50" placeholder="Enter search term"
                    value={inputValue} onKeyDown={handleKeyDown}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-1 bg-c1" onClick={handleSearch}>
                    Search
                </button>
                <button className="btn-1 bg-d4 ml-2" onClick={handleClear}>
                    Clear
                </button>
            </div>
        </div>
    );
}

export default SearchBar;