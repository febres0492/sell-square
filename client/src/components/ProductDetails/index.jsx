// import { useEffect, useState, useCallback } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
// import { QUERY_PRODUCT_BY_ID, QUERY_USER, QUERY_CONVERSATIONS } from '../utils/queries';
// import Auth from "../utils/auth";
// import { showModal } from '../components/Modal'; 
// import useSendMessage from '../utils/useSendMessage';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

function ProductDetails(props) {
    const { id } = props;
    // console.log(c.yellow, 'id', id);
    // // const navigate = useNavigate();
    // const { loading, data, error } = useQuery(QUERY_PRODUCT_BY_ID, { variables: { id } });
    // const [loggedIn] = useState(Auth.loggedIn());
    // const { data: userData } = useQuery(QUERY_USER);
    // const productSellerId = data?.product?.user._id;
    // const { data: convData } = useQuery(QUERY_CONVERSATIONS, { 
    //     variables: { participantId: productSellerId, productId: id } 
    // });
    
    // const { sendMessage } = useSendMessage();
    // const [convExit, setConvExit] = useState(false);

    // useEffect(() => {
    //     if (convData && convData.conversation && convData.conversation.length > 0) {
    //         setConvExit(true);
    //     }
    // }, [convData]);

    // const handleSendMessage = useCallback(async () => {
    //     if (convExit) {
    //         navigate(`/conversation/${convData.conversation[0]._id}`);
    //     } else {
    //         const newMessage = await sendMessage({
    //             recipientId: productSellerId,
    //             messageText: 'I am interested in your product',
    //             productId: id
    //         });
    //         if (newMessage) {
    //             console.log(c.green, 'newMessage', newMessage.conversationId);
    //             navigate(`/conversation/${newMessage.conversationId}`);
    //         }
    //     }
    // }, [convExit, convData, data, navigate, productSellerId, sendMessage]);

    // if (loading) return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;

    // if (error) {
    //     return (
    //         <div className="container">
    //             <Link to="/">
    //                 <button className="btn btn-primary">
    //                     ← Back to Products
    //                 </button>
    //             </Link>
    //             <div className="text-danger">Error: {error.message}</div>
    //         </div>
    //     );
    // }

    // const product = data?.product || {};
    // const isMyProduct = product.user._id === userData?.user?._id;

    // console.log(c.yellow, 'product', product);

    // const handleEditButton = () => {
    //     if (loggedIn) {
    //         navigate(`/edit-product/${product._id}`);
    //     } else {
    //         showModal('Please log in to edit this product');
    //     }
    // };

    return (
        <div className="container">
            <Link to="/">
                <button className="btn btn-primary">
                    ← Back to Products
                </button>
            </Link>
            {/* <div className="row">
                {product ? (
                    <div className="card">
                        <img className="card-img-top" src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
                        <div className="card-body">
                            <p className="card-text"><strong>Seller:</strong> {product.user.firstName} {product.user.lastName}</p>
                            <h2 className="card-title">{product.name}</h2>
                            <p className="card-text">{product.description}</p>
                            <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                            <p className="card-text"><strong>Category:</strong> {product.category.name}</p>
                            <p className="card-text"><strong>Quantity:</strong> {product.quantity}</p>
                            <p className="card-text"><strong>Zipcode:</strong> {product.zipcode}</p>
                            {loggedIn && isMyProduct && (
                                <button className="btn btn-secondary" onClick={handleEditButton}>
                                    Edit
                                </button>
                            )}
                            {loggedIn && !isMyProduct && (
                                <button className="btn btn-primary" onClick={handleSendMessage}>
                                    Message Seller
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>Product not found</div>
                )}
            </div> */}
        </div>
    );
}

export default ProductDetails;