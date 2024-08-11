import React from 'react';
import updateState from '../../utils/updateState';
import { useStoreContext } from '../../utils/GlobalState';
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoryMenu() {
    const [state, dispatch] = useStoreContext();
    const { loading: loadingCat, data: categories } = updateState('categories');

    const handleClick = (ev) => {
        const { name } = ev.target;
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach((btn) => {
            btn.classList.remove('cat-btn');
        });
        ev.target.classList.add('cat-btn');

        dispatch({
            type: "UPDATE_CURRENT_CATEGORY",
            currentCategory: name,
        });
    };

    if (loadingCat) return (
        <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid">
            <div className="d-flex overflow-x text-nowrap bg-d2 rounded scrollbar pb-1">
                <button name="" className="category-btn cat-btn btn-1 bg-l2 m-1" onClick={(e) => { handleClick(e)}} >
                    All
                </button>
                {categories.map((item) => (
                    <button name={item.name} key={item._id} className="category-btn btn-1 bg-l2 c1 m-1"
                        onClick={(e) => { handleClick(e); }}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryMenu;