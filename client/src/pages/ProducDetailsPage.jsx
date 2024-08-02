import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Button, Card, CardContent, CardMedia, CircularProgress } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { QUERY_PRODUCT_BY_ID, QUERY_PRODUCTS_BY_SEARCH_TERM } from '../utils/queries';

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
                <Button component={Link} to="/" variant="contained" color="primary" className={classes.backButton}>
                    ← Back to Products
                </Button>
                <Typography color="error">Error: {error.message}</Typography>
            </Container>
        );
    }

    const product = data?.product || {};

    return (
        <Container className={classes.container}>
            <Button component={Link} to="/" variant="contained" color="primary" className={classes.backButton}>
                ← Back to Products
            </Button>
            {product ? (
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.media}
                        image={product.image || 'https://via.placeholder.com/150'}
                        title={product.name}
                    />
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {product.name}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {product.description}
                        </Typography>
                        <Typography variant="body1" component="p">
                            <strong>Price:</strong> ${product.price}
                        </Typography>
                        <Button
                            component={Link}
                            to={`/edit-product/${product._id}`}
                            variant="contained"
                            color="secondary"
                            startIcon={<EditIcon />}
                            className={classes.editButton}
                        >
                            Edit
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Typography>Product not found</Typography>
            )}
        </Container>
    );
}

export default ProductDetailsPage;