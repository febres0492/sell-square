import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCT, QUERY_PRODUCTS_BY_SEARCH_TERM } from '../utils/queries';
import spinner from '../assets/spinner.gif';

function ProductDetailsPage() {
    const { id } = useParams();
    const { loading, data, error } = useQuery(QUERY_PRODUCT, { variables: { id }, });
    
    if (loading) return <img src={spinner} alt="loading" />;

    if (error) {
        return (
            <div className="container my-1">
                <Link to="/">← Back to Products</Link>
                <p>Error: {error.message}</p>;
            </div>
        );
    }

    const product = data?.product || {};

    return (
        <div className="container my-1">
            <Link to="/">← Back to Products</Link>
            {product ? (
                <>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>
                        <strong>Price:</strong>${product.price}{' '}
                    </p>
                    <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
                </>
            ) : (
                <p>Product not found</p>
            )}
        </div>
    );
}

export default ProductDetailsPage;