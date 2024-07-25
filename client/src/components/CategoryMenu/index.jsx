import React from 'react';
import useFetchCategories from '../../utils/useFetchCategories';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_CURRENT_CATEGORY } from '../../utils/actions';

function CategoryMenu() {
    const [state, dispatch] = useStoreContext();
    const { loadingCat, categories } = useFetchCategories();

    const handleClick = (id) => {
        dispatch({
            type: UPDATE_CURRENT_CATEGORY,
            currentCategory: id,
        });
    };

    if (loadingCat) return <p>Loading categories...</p>;

    return (
        <div>
            <h2>Choose a Category:</h2>
            {categories.map((item) => (
                <button key={item._id} onClick={() => { handleClick(item._id); }} >
                    {item.name}
                </button>
            ))}
            <button onClick={() => { handleClick(''); }} >
                All
            </button>
        </div>
    );
}

export default CategoryMenu;