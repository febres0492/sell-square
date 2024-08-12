import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ifLoggedIn from '../../utils/ifLoggedIn';
import { QUERY_USER_PRODUCTS } from '../../utils/queries';
import { useStoreContext } from '../../utils/GlobalState';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

function Products({ selectComponent }) {
    const { loading, error, data, refetch } = ifLoggedIn(QUERY_USER_PRODUCTS);
    const [state, dispatch] = useStoreContext();

    useEffect(() => { refetch(); }, [refetch]);

    const goToComp = (e,comp) => { if(selectComponent) { selectComponent(e,comp) } }

    const products = data?.products || [];

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only"></span></div>;
    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

    return (
        <div className="container-fluid">
            <div className="container-box ">
                <div className="row row-gap-4 jcsb">
                    <div className="col-12 d-flex jcsb aic">
                        <h3 className="m-0">Products</h3>
                        <button className="btn-1 bg-c1" onClick={(e) => goToComp(e,'AddProduct')}>Add Product</button>
                    </div>
                    {products.length === 0 ? (
                        <div className="col">
                            <h6>No Products</h6>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div className="col-6 col-sm-4 col-md-3 col-lg-2 tac" key={product._id}>
                                <Link to={`/products/${product._id}`}>
                                    <div className="card">
                                        <img
                                            src={product.image || 'https://via.placeholder.com/150'}
                                            className="card-img-top"
                                            alt={product.name || 'Image title'}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">{product.description}</p>
                                            <p className="card-text"><small className="text-muted">{product.category.name}</small></p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Products;