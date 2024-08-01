import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    CssBaseline,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    Divider,
    IconButton,
    Box,
    Container,
    Grid,
    Paper,
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
import { QUERY_USER } from '../utils/queries';
import { useStoreContext } from '../utils/GlobalState';

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

    const { loading, error, data } = useQuery(QUERY_USER);

    if (loading) return <CircularProgress />;
    if (error) return <Typography variant="h6" color="error">Error: {error.message}</Typography>;

    return (
        <Container>
            <Typography variant="h5">Your Products</Typography>
            <Grid container spacing={3}>
                {data.user.products.map((product) => (
                    <Grid className='' item key={product._id} xs={6} md={6} lg={4}>
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
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Dashboard;