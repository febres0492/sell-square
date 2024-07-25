import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../utils/queries';
import { UPDATE_CATEGORIES } from '../utils/actions';
import { useStoreContext } from '../utils/GlobalState';

const useFetchCategories = () => {
    const [state, dispatch] = useStoreContext();
    const { categories } = state;

    const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

    useEffect(() => {
        if (!categories.length && categoryData) {
            dispatch({
                type: UPDATE_CATEGORIES,
                categories: categoryData.categories,
            });
        }
    }, [loading, categoryData, categories.length, dispatch]);

    return { loading, categories };
};

export default useFetchCategories;