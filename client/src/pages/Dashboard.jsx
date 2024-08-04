import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    // CssBaseline,
    // Drawer,
    // AppBar,
    // Toolbar,
    Typography,
    // Divider,
    // IconButton,
    // Box,
    Container,
    Grid,
    // Paper,
    CircularProgress,
    Card,
    CardContent,
    CardMedia
} from '@material-ui/core';
// import {
//     Menu as MenuIcon,
//     ChevronLeft as ChevronLeftIcon,
//     Dashboard as DashboardIcon,
//     People as PeopleIcon,
//     BarChart as BarChartIcon,
//     Layers as LayersIcon
// } from '@material-ui/icons';
// import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_USER_CONVERSATIONS, QUERY_USER_PRODUCTS } from '../utils/queries';
// import { useStoreContext } from '../utils/GlobalState';

const c = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m'
};

const useStyles = makeStyles((theme) => ({
    // Your styles here
    card: {
        display: 'flex',
        marginBottom: theme.spacing(2),
    },
    cardMedia: {
        width: 160,
    },
    cardContent: {
        flex: '1 0 auto',
    },
}));

const Dashboard = () => {
    const classes = useStyles();

    const { loading, error, data } = useQuery(QUERY_USER_PRODUCTS);
    console.log('products', data);
    const products = data?.products || [];

    // if(!loading && !user) window.location.replace('/login');

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

    return (<>
        <Container>
            <Conversations />
            <Typography variant="h5">Your Products</Typography>
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item className='' key={product._id} xs={6} md={6} lg={4}>
                        <Link to={`/products/${product._id}`}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image={product.image || 'https://via.placeholder.com/150'}
                                    title={product.name || 'Image title'}
                                />
                                <CardContent className={classes.cardContent}>
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
    </>);
};

function Conversations() {
    const classes = useStyles();
    let conversationsData = useQuery(QUERY_USER_CONVERSATIONS).data?.userConversations || [];
    console.log('component conversations', conversationsData);

    return (
        <>
            <Typography variant="h5">Conversations</Typography>
            <Grid container border spacing={3}>
                {conversationsData.map(data => (
                    
                    <Grid item className='' xs={6} md={6} lg={4}>
                        <Link to={`/products/${data.productId._id}`}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image={data.productId.image || 'https://via.placeholder.com/150'}
                                    title={data.productId.name || 'Image title'}
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography component="h5" variant="h5">
                                        {data.productId.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {data.productId.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default Dashboard;