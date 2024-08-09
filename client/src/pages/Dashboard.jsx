import React, { useEffect } from 'react';
import {
    Typography,
    Divider,
    Button,
    Box,
    Container,
    Grid,
    Paper,
    CircularProgress,
    Card,
    CardContent,
    CardMedia
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import ifLoggedIn from '../utils/ifLoggedIn';
import { QUERY_USER, QUERY_USER_CONVERSATIONS, QUERY_USER_PRODUCTS, QUERY_CONVERSATIONS } from '../utils/queries';
import { showModal } from '../components/Modal';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

const Dashboard = () => {
    const { loading, error, data } = ifLoggedIn(QUERY_USER_PRODUCTS);
    const products = data?.products || [];

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

    return (
        <>
            <Container className='my-4'>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Link to="/">
                        <Button variant="contained" color="primary">
                            ← Home
                        </Button>
                    </Link>
                    <Link to="/add-product">
                        <Button variant="contained" color="primary">
                            Add Product
                        </Button>
                    </Link>
                </Box>
            </Container>

            <Container className='my-4'>
                <Conversations />
            </Container>

            <Container className='my-4'>
                <Typography variant="h5">Your Products</Typography>
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item key={product._id} xs={6} md={6} lg={4}>
                            <Link to={`/products/${product._id}`}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={product.image || 'https://via.placeholder.com/150'}
                                        title={product.name || 'Image title'}
                                    />
                                    <CardContent>
                                        <Typography component="h5" variant="h5">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {product.description}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {product.category.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

function Conversations() {
    const userData = useQuery(QUERY_USER).data?.user || {};
    const { loading, error, data, refetch } = useQuery(QUERY_CONVERSATIONS, { variables: { userId: userData._id } });

    useEffect(() => { refetch(); }, [refetch]);

    console.log(c.yellow, 'userData', data);

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

    const conversationsData = Object.values(data)[0] || [];
    console.log(c.yellow, 'conversations', data, conversationsData);

    return (
        <>
            <Typography variant="h5">Conversations</Typography>
            <Grid container spacing={3}>
                {conversationsData.length === 0 ?
                    <Grid item>
                        <Typography variant="h6">No Conversations</Typography>
                    </Grid>
                    :
                    (conversationsData.map(con => {
                        const participant = con.participants;
                        const fistLast = participant.firstName || '' + ' ' + participant.lastName || '';
                        console.log('participant', participant);

                        return (
                            <Grid item key={con._id} xs={6} md={6} lg={4}>
                                <Link to={`/conversation/${con._id}`}>
                                    <Card>
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={con.productId.image || 'https://via.placeholder.com/150'}
                                            title={con.productId.name || 'Image title'}
                                        />
                                        <CardContent>
                                            <Typography component="h5" variant="h5">
                                                {con.productId.name}
                                            </Typography>
                                            <Typography variant="subtitle1" color="textSecondary">
                                                {con.productId.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        )
                    }))}
            </Grid>
        </>
    );
}

export default Dashboard;