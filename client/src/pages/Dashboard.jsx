import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import ifLoggedIn from '../utils/ifLoggedIn';
import { QUERY_USER, QUERY_USER_CONVERSATIONS, QUERY_USER_PRODUCTS, QUERY_CONVERSATIONS } from '../utils/queries';
import { showModal } from '../components/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

const Dashboard = () => {
    const { loading, error, data } = ifLoggedIn(QUERY_USER_PRODUCTS);
    const products = data?.products || [];

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;
    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

    return (
        <>
            <div className="container my-4">
                <div className="d-flex justify-content-between align-items-center">
                    <Link to="/">
                        <button className="btn btn-primary">
                            ← Home
                        </button>
                    </Link>
                    <Link to="/add-product">
                        <button className="btn btn-primary">
                            Add Product
                        </button>
                    </Link>
                </div>
            </div>

            <div className="container my-4">
                <Conversations />
            </div>

            <div className="container my-4">
                <h5>Your Products</h5>
                <div className="row">
                    {products.map((product) => (
                        <div className="col-6 col-md-6 col-lg-4 mb-3" key={product._id}>
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
                    ))}
                </div>
            </div>
        </>
    );
};

function Conversations() {
    const userData = useQuery(QUERY_USER).data?.user || {};
    const { loading, error, data, refetch } = useQuery(QUERY_CONVERSATIONS, { variables: { userId: userData._id } });

    useEffect(() => { refetch(); }, [refetch]);

    console.log(c.yellow, 'userData', data);

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;
    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;

    const conversationsData = Object.values(data)[0] || [];
    console.log(c.yellow, 'conversations', data, conversationsData);

    return (
        <>
            <h5>Conversations</h5>
            <div className="row">
                {conversationsData.length === 0 ?
                    <div className="col">
                        <h6>No Conversations</h6>
                    </div>
                    :
                    (conversationsData.map(con => {
                        const participant = con.participants;
                        const fistLast = participant.firstName || '' + ' ' + participant.lastName || '';
                        console.log('participant', participant);

                        return (
                            <div className="col-6 col-md-6 col-lg-4 mb-3" key={con._id}>
                                <Link to={`/conversation/${con._id}`}>
                                    <div className="card">
                                        <img
                                            src={con.productId.image || 'https://via.placeholder.com/150'}
                                            className="card-img-top"
                                            alt={con.productId.name || 'Image title'}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{con.productId.name}</h5>
                                            <p className="card-text">{con.productId.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    }))}
            </div>
        </>
    );
}

export default Dashboard;