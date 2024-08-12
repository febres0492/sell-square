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
        <div className="container-fluid text-white">
            <div className="row">
                <div className="mt-3 d-flex flex-column flex-sm-row gap-2">
                    <input type="text" className="form-control fg" placeholder="Enter search term or Zipcode"
                        style={{ "--maxw": '600px' }}
                        value={inputValue} onKeyDown={handleKeyDown}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-1 bg-c1 m-0" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>
            <div className="row">
                <div className="mt-3">
                {loading ? (
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    ) : (
                        <div className='df jcc aic gap-2 pt-2'>
                            {searchQuery ? (
                                <div className='border pointer d-flex gap-2 aic px-2 rounded' onClick={handleClear}>
                                    <h2 id="res-title" className='m-0'>{ searchQuery }</h2>
                                    <div id="clear-res-div" className='rounded bg-d4'>
                                        <span id="res-x" className="close" aria-hidden="true">&times;</span>
                                    </div>
                                </div>
                            ) : (
                                <h2 className='m-0'>All Products</h2>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;