import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    // CssBaseline,
    // Drawer,
    // AppBar,
    // Toolbar,
    Typography,
    Divider,
    Button,
    // IconButton,
    Box,
    Container,
    Grid,
    Paper,
    CircularProgress,
    Card,
    CardContent,
    CardMedia
} from '@material-ui/core';
import { Link } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
import ifLoggedIn from '../utils/ifLoggedIn';
import { QUERY_USER, QUERY_USER_CONVERSATIONS, QUERY_USER_PRODUCTS, QUERY_CONVERSATIONS  } from '../utils/queries';
import { showModal } from '../components/Modal'; 
import { useQuery } from '@apollo/client';


const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

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
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const Dashboard = () => {
    const classes = useStyles();
    const { loading, error, data } = ifLoggedIn(QUERY_USER_PRODUCTS);
    const products = data?.products || [];

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

    return (<>
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
    const userData = useQuery(QUERY_USER).data?.user || {};
    const { loading, error, data, refetch } = useQuery(QUERY_CONVERSATIONS, { variables: { userId: userData._id } });

    useEffect(() => { refetch(); }, [refetch]);

    console.log(c.yellow,'userData', data);
    // const { loading, error, data } = ifLoggedIn(QUERY_USER_CONVERSATIONS);

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

    const conversationsData = Object.values(data)[0] || [];
    console.log(c.yellow,'conversations', data, conversationsData);

    return (
        <>
            <Typography variant="h5">Conversations</Typography>
            <Grid container spacing={3}>
                { conversationsData.length == 0 ? 
                    <Grid item className='' >
                        <Typography variant="h6">No Conversations </Typography>
                    </Grid>
                    :
                    ( conversationsData.map(con => {
                        const participant = con.participants;
                        const fistLast = participant.firstName || '' + ' ' + participant.lastName || '';
                        console.log('participant', participant, );

                        return (
                            <Grid item className='' xs={6} md={6} lg={4}>
                                <Link to={`/conversation/${con._id}`}>
                                    <Card className={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={con.productId.image || 'https://via.placeholder.com/150'}
                                            title={con.productId.name || 'Image title'}
                                        />
                                        <CardContent className={classes.cardContent}>
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
                    }) )}
            </Grid>
        </>
    );
}

export default Dashboard;