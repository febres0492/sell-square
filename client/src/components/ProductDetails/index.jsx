import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCT_BY_ID, QUERY_USER, QUERY_CONVERSATIONS } from '../../utils/queries';
import Auth from "../../utils/auth";
import { showModal } from '../../components/Modal'; 
import useSendMessage from '../../utils/useSendMessage';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

function ProductDetails(props) {
    const { id } = props;
    const selectComponent = props.selectComponent;

    const goToComp = (args) => { 
        if (selectComponent) { selectComponent(args) } 
    }
    
    console.log(c.yellow, 'id', id);
    const navigate = useNavigate();
    const { loading, data, error } = useQuery(QUERY_PRODUCT_BY_ID, { variables: { id } });
    const [loggedIn] = useState(Auth.loggedIn());
    const { data: userData } = useQuery(QUERY_USER);
    const productSellerId = data?.product?.user._id;
    const { data: convData } = useQuery(QUERY_CONVERSATIONS, { 
        variables: { participantId: productSellerId, productId: id } 
    });
    
    const { sendMessage } = useSendMessage();
    const [convExit, setConvExit] = useState(false);

    useEffect(() => {
        if (convData && convData.conversation && convData.conversation.length > 0) {
            setConvExit(true);
        }
    }, [convData]);

    const handleSendMessage = useCallback(async () => {
        if (convExit) {
            navigate(`/conversation/${convData.conversation[0]._id}`);
        } else {
            const newMessage = await sendMessage({
                recipientId: productSellerId,
                messageText: '--startconversation',
                productId: id
            });
            if (newMessage) {
                console.log(c.green, 'newMessage', newMessage.conversationId);
                navigate(`/conversation/${newMessage.conversationId}`);
            }
        }
    }, [convExit, convData, data, navigate, productSellerId, sendMessage]);

    if (loading) return <div className="spinner-border" role="status"><span className="sr-only"></span></div>;

    if (error) {
        return (
            <div className="container">
                <button className="btn-1 bg-c1 m-0" onClick={(e) => navigate('/dashboard/Products')}>
                    ← Back
                </button>
                <div className="text-danger">Error: {error.message}</div>
            </div>
        );
    }

    const product = data?.product || {};
    const isMyProduct = product.user._id === userData?.user?._id;

    console.log(c.yellow, 'product', product);

    const handleEditButton = () => {
        if (loggedIn) {
            navigate(`/dashboard/EditProduct/${product._id}`);
        } else {
            showModal('Please log in to edit this product');
        }
    };

    return (<>
        <div className="container-fluid">
            <div className="col-12 df jcsb aic ">
                <button className="btn-1 bg-c1 m-0" onClick={(e) => navigate(`/dashboard/Products`)}>Back</button>
                {/* <button className="btn-1 bg-c1 m-0" onClick={(e) => goToComp({component:'Products'})}>Back</button> */}
            </div>
        </div>
    
        <div className="container-fluid">
            <div className="container-box ">
                <div className="col-12 df jcc aic mb-3">
                    <h3 className="m-0">{product.name}</h3>
                </div>
                
                <div className="col">
                    {product ? (<div className='row'>
                    
                        <div className="col-12 col-sm-6">
                            <div className="img-div">
                                <img className="card-img-left" src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
                            </div>
                        </div>
                        <div className="col-12 col-sm-6">
                            <div className="card-body">
                                <h2 className="card-title">Description</h2>
                                <p className="card-text"><strong>Seller:</strong> {product.user.firstName} {product.user.lastName}</p>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                                <p className="card-text"><strong>Category:</strong> {product.category.name}</p>
                                <p className="card-text"><strong>Quantity:</strong> {product.quantity}</p>
                                <p className="card-text"><strong>Zipcode:</strong> {product.zipcode}</p>
                                {loggedIn && isMyProduct && (
                                    <button className="btn btn-primary px-4" onClick={handleEditButton}>
                                    {/* <button className="btn btn-primary px-4" onClick={()=>goToComp({component:'EditProduct', id:product._id})}> */}
                                        Edit
                                    </button>
                                )}
                                {loggedIn && !isMyProduct && (
                                    <button className="btn btn-primary px-4" onClick={handleSendMessage}>
                                        Message Seller
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>) : (
                        <div>Product not found</div>
                    )}
                </div>
            </div>
        </div>
    </>);
}

export default ProductDetails;