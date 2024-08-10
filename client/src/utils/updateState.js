import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES, QUERY_ALL_PRODUCTS } from '../utils/queries';
import { useStoreContext } from '../utils/GlobalState';

const queries = {
    products: QUERY_ALL_PRODUCTS,
    categories: QUERY_CATEGORIES
};

const actionTypes = {
    products: 'UPDATE_SEARCH_RESULTS',
    categories: 'UPDATE_CATEGORIES'
};

const updateState = (dataKey, data) => {
    const [state, dispatch] = useStoreContext();
    const dataState = state[dataKey];

    const query = queries[dataKey];

    const { loading, data: fetchedData } = useQuery(query, {
        skip: !!data, // skip the query if data is provided
    })

    useEffect(() => {
        if (!dataState.length && (data || fetchedData)) {
            dispatch({
                type: actionTypes[dataKey],
                [dataKey]: data ? data[dataKey] : fetchedData[dataKey],
            });
        }
    }, [loading, fetchedData, dataState.length, dispatch, dataKey, data]);

    return { loading: !data && loading, data: data || dataState };
};

export default updateState;