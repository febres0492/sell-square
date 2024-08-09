import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import { updateSearchResults } from '../../utils/actions';
import { QUERY_ALL_PRODUCTS, QUERY_PRODUCTS_BY_SEARCH_TERM } from '../../utils/queries';
import { Link } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@material-ui/core';

function SearchBar() {
    const [inputValue, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { loading: allLoading, data: allData, error: allError } = useQuery(QUERY_ALL_PRODUCTS);
    const allProducts = allData?.products || [];
    console.log('All Products:', allProducts);

    const { loading, data, error } = useQuery(QUERY_PRODUCTS_BY_SEARCH_TERM, {
        variables: { searchTerm: searchQuery },
        skip: !searchQuery
    });

    const [state, dispatch] = useStoreContext();

    useEffect(() => {
        if (loading) {
            console.log('Loading...');
        } else if (error) {
            console.error('Error:', error);
        } else if (data) {
            console.log('Data:', data);
            dispatch(updateSearchResults(data.products));
        } else if (!searchQuery && allData) {
            dispatch(updateSearchResults(allProducts));
        }
    }, [loading, data, error, allData, searchQuery, dispatch]);

    const handleSearch = () => {
        setSearchQuery(inputValue);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSearchQuery('');
        dispatch(updateSearchResults(allProducts));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom> Products </Typography>
            <TextField
                label="Enter search term"
                variant="outlined"
                value={inputValue}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                Search
            </Button>
            <Button variant="contained" color="default" onClick={handleClear} style={{ marginLeft: '10px' }}>
                Clear
            </Button>
        </Box>
    );
}

export default SearchBar;