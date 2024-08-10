import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES, QUERY_ALL_PRODUCTS } from '../utils/queries';
// import { UPDATE_CATEGORIES } from '../utils/actions';
import { useStoreContext } from '../utils/GlobalState';

const useFetchCategories = () => {
    const [state, dispatch] = useStoreContext();
    const { categories } = state;

    const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

    useEffect(() => {
        if (!categories.length && categoryData) {
            dispatch({
                type: 'UPDATE_CATEGORIES',
                categories: categoryData.categories,
            });
        }
    }, [loading, categoryData, categories.length, dispatch]);

    return { loading, categories };
};


const queries = {
    searchResult: QUERY_ALL_PRODUCTS,
    categories: QUERY_CATEGORIES
};

const actionTypes = {
    searchResult: 'UPDATE_SEARCH_RESULTS',
    categories: 'UPDATE_CATEGORIES'
};

const useRefetch = (dataKey) => {
    const [state, dispatch] = useStoreContext();
    const dataState = state[dataKey];

    const query = queries[dataKey];

    const { loading, data: fetchedData } = useQuery(query);

    useEffect(() => {
        if (!dataState.length && fetchedData) {
            dispatch({
                type: actionTypes[dataKey],
                [dataKey]: fetchedData[dataKey],
            });
        }
    }, [loading, fetchedData, dataState.length, dispatch, dataKey]);

    return { loading, data: dataState };
};

export { useRefetch }

export default useFetchCategories;