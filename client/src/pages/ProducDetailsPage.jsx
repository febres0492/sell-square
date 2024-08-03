import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Button, Card, CardContent, CardMedia, CircularProgress, Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { QUERY_PRODUCT_BY_ID, QUERY_USER_CONVERSATIONS } from '../utils/queries';
import MessageComponent from '../components/MessageComponent';

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

function ProductDetailsPage() {
    const classes = useStyles();
    const { id } = useParams();
    const { loading, data, error } = useQuery(QUERY_PRODUCT_BY_ID, { variables: { id }, });
        
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

    return (
        <Container className={classes.container}>
            <Link to="/" className={classes.backButton}>
                <Button variant="contained" color="primary" className={classes.backButton}>
                    ← Back to Products
                </Button>
            </Link>
            <Grid container >
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
                            <Link to={`/edit-product/${product._id}`}>
                                <Button variant="contained" color="secondary" startIcon={<EditIcon />} 
                                    className={classes.editButton} 
                                    >Edit
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : ( <Typography>Product not found</Typography> )}
            </Grid>
            <Grid container className='border mb-4'>
                <MessageComponent recipientId={product.user._id} productId={id} />
            </Grid>
        </Container>
    );
}

export default ProductDetailsPage;