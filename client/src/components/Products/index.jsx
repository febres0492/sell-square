import React from 'react';
import { Link } from 'react-router-dom';
import ifLoggedIn from '../../utils/ifLoggedIn';
// Ensure these are imported or defined elsewhere in your code
import {  QUERY_USER_PRODUCTS } from '../../utils/queries';

function Products() {
    const { loading, error, data, refetch } = ifLoggedIn(QUERY_USER_PRODUCTS);

    const products = data?.products || [];

    console.log('products', products);

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only"></span></div>;
    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;
    return (
        <div className="container-fluid">
            <div className="container-box">
                
                <h5>Products</h5>
                <button className="btn-1 m-0 bg-c1" onClick={() => setShowComponent('add-product')}> Add Product </button>
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
    );
}

export default Products;