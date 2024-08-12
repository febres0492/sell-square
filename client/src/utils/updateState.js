import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES, QUERY_ALL_PRODUCTS, QUERY_USER_PRODUCTS } from '../utils/queries';
import { useStoreContext } from '../utils/GlobalState';

const queries = {
    products: QUERY_ALL_PRODUCTS,
    categories: QUERY_CATEGORIES,
    myProducts: QUERY_USER_PRODUCTS,
};

const actionTypes = {
    products: 'UPDATE_SEARCH_RESULTS',
    categories: 'UPDATE_CATEGORIES',
    myProducts: 'UPDATE_MY_PRODUCTS',
    dasboardPage: 'UPDATE_DASHBOARD_PAGE'
};

const updateState = (dataKey, data) => {
    const [state, dispatch] = useStoreContext();
    const dataState = state[dataKey];
    const query = queries[dataKey];

    // If data is an object with just one key, extract its value
    if (data && typeof data === 'object' && Object.keys(data).length === 1) {
        data = Object.values(data)[0];
    }

    const { loading, data: fetchedData } = useQuery(query, {
        skip: !!data, 
    });

    const newData = fetchedData ? Object.values(fetchedData)[0] : data;

    useEffect(() => {
        if (!dataState.length && (data || fetchedData)) {
            const payload = {
                type: actionTypes[dataKey],
                [dataKey]: data || newData,
            };
            dispatch(payload);
        }
    }, [loading, fetchedData, dataState.length, dispatch, dataKey, data]);

    return { data: newData, loading }; 
};

export default updateState;