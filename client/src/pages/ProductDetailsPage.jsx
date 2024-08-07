import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Button, Card, CardContent, CardMedia, CircularProgress, Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { QUERY_PRODUCT_BY_ID, QUERY_USER, QUERY_CONVERSATIONS } from '../utils/queries';
import Auth from "../utils/auth";
import { showModal } from '../components/Modal'; 
import useSendMessage from '../utils/useSendMessage';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(2),
    },
    backButton: {
        marginBottom: theme.spacing(2),
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
    media: {
        height: 150,
        width: 150,
        marginBottom: theme.spacing(2),
    },
    editButton: {
        marginTop: theme.spacing(2),
    },
}));

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

function ProductDetailsPage() {
    const classes = useStyles();
    const { id } = useParams();
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
                messageText: 'I am interested in your product',
                productId: id
            });
            if (newMessage) {
                console.log(c.green, 'newMessage', newMessage.conversationId);
                navigate(`/conversation/${newMessage.conversationId}`);
            }
        }
    }, [convExit, convData, data, navigate, productSellerId, sendMessage]);

    if (loading) return <CircularProgress />;

    if (error) {
        return (
            <Container className={classes.container}>
                <Link to="/" className={classes.backButton}>
                    <Button variant="contained" color="primary" className={classes.backButton}>
                        ← Back to Products
                    </Button>
                </Link>
                <Typography color="error">Error: {error.message}</Typography>
            </Container>
        );
    }

    const product = data?.product || {};
    const isMyProduct = product.user._id === userData?.user?._id;

    const handleEditButton = () => {
        if (loggedIn) {
            navigate(`/edit-product/${product._id}`);
        } else {
            showModal('Please log in to edit this product');
        }
    };

    return (
        <Container className={classes.container}>
            <Link to="/" className={classes.backButton}>
                <Button variant="contained" color="primary" className={classes.backButton}>
                    ← Back to Products
                </Button>
            </Link>
            <Grid container>
                {product ? (
                    <Card className={classes.card}>
                        <CardMedia className={classes.media} title={product.name}
                            image={product.image || 'https://via.placeholder.com/150'}
                        />
                        <CardContent>
                            <Typography variant="body1" component="p"> <strong>Seller:</strong> {product.user.firstName} {product.user.lastName}</Typography>
                            <Typography variant="h5" component="h2"> {product.name} </Typography>
                            <Typography variant="body2" component="p"> {product.description} </Typography>
                            <Typography variant="body1" component="p"> <strong>Price:</strong> ${product.price} </Typography>
                            <Typography variant="body1" component="p"> <strong>Category:</strong> {product.category.name} </Typography>
                            <Typography variant="body1" component="p"> <strong>Quantity:</strong> {product.quantity} </Typography>
                            <Typography variant="body1" component="p"> <strong>Zipcode:</strong> {product.zipcode} </Typography>
                            {loggedIn && isMyProduct && (
                                <Button variant="contained" color="secondary" startIcon={<EditIcon />} 
                                    className={classes.editButton} onClick={handleEditButton}>
                                    Edit
                                </Button>
                            )}
                            {loggedIn && !isMyProduct && (
                                <Button variant="contained" color="primary" 
                                    className={classes.editButton} onClick={handleSendMessage}>
                                    Message Seller
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Typography>Product not found</Typography>
                )}
            </Grid>
        </Container>
    );
}

export default ProductDetailsPage;