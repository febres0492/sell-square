import React from 'react';
import updateState from '../../utils/updateState';
import { useStoreContext } from '../../utils/GlobalState';
import 'bootstrap/dist/css/bootstrap.min.css';

function CategoryMenu() {
    const [state, dispatch] = useStoreContext();
    const { loading: loadingCat, data: categories } = updateState('categories');

    const handleClick = (id) => {
        dispatch({
            type: "UPDATE_CURRENT_CATEGORY",
            currentCategory: id,
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
            <div className="d-flex overflow-x text-nowrap bg-d2 rounded scrollbar">
                <button className="btn-1 bg-l2 m-1" onClick={() => { handleClick(''); }} >
                    All
                </button>
                {categories.map((item) => (
                    <button key={item._id} className="btn-1 bg-l2 c1 m-1"
                        onClick={() => { handleClick(item._id); }}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
// function CategoryMenu() {
//     const [state, dispatch] = useStoreContext();
//     const { loadingCat, categories } = useFetchCategories();

//     const handleClick = (id) => {
//         dispatch({
//             type: UPDATE_CURRENT_CATEGORY,
//             currentCategory: id,
//         });
//     };

//     if (loadingCat) return (
//         <div className="d-flex justify-content-center">
//             <div className="spinner-border" role="status">
//                 <span className="sr-only">Loading...</span>
//             </div>
//         </div>
//     );

//     return (
//         <div className="container-fluid">
//             <div className="d-flex overflow-x text-nowrap bg-d2 rounded scrollbar">
//                 <button className="btn-1 bg-l2 m-1" onClick={() => { handleClick(''); }} >
//                     All
//                 </button>
//                 {categories.map((item) => (
//                     <button key={item._id} className="btn-1 bg-l2 c1 m-1"
//                         onClick={() => { handleClick(item._id); }}
//                     >
//                         {item.name}
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// }

export default CategoryMenu;