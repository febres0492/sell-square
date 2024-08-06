import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PRODUCT } from '../utils/mutations';
import { QUERY_PRODUCT_BY_ID } from '../utils/queries';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, Container, Paper, Card, CardMedia } from '@material-ui/core';
import { useParams, useNavigate } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(4),
        padding: theme.spacing(2),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        marginBottom: theme.spacing(2),
    },
    button: {
        marginBottom: theme.spacing(2),
    },
}));

function EditProductPage() {
    const classes = useStyles();
    const navigate = useNavigate();
    const { id } = useParams();


    const { loading, data, error } = useQuery(QUERY_PRODUCT_BY_ID, {
        variables: { id },
    });

    const [formState, setFormState] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        image: '',
        zipcode: '',
    });


    const [updateProduct, { error: updateError }] = useMutation(UPDATE_PRODUCT);

    useEffect(() => {
        if (data) {
            setFormState({
                name: data.product.name,
                description: data.product.description,
                image: data.product.image,
                price: parseInt(data.product.price),
                quantity: parseInt(data.product.quantity),
                zipcode: parseInt(data.product.zipcode),
            });
        }
    }, [data]);

    const handleChange = (event) => {
        const { name, value, type } = event.target;
        setFormState({
            ...formState,
            [name]: type === 'number' ? parseInt(value) : value
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log('formState', formState, id );
            await updateProduct({ variables: { id, ...formState }, })
            
            navigate(`/products/${id}`);
        } catch (e) {
            console.error(e, updateError);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading product</Typography>;

    const product = data.product || {};

    return (
        <Container maxWidth="md">
            <Paper className={classes.container}>
                <Typography variant="h4" gutterBottom>
                    Update Product
                </Typography>
                <Card className="mb-4">
                    {product.image && (
                        <CardMedia
                            component="img"
                            alt={product.name}
                            height="140"
                            image={product.image}
                            title={product.name}
                        />
                    )}
                </Card>
                <Button type="submit" variant="contained" color="primary" className={classes.button} >
                    Update Image
                </Button>
                <form className={classes.form} onSubmit={handleFormSubmit}>
                    <TextField
                        className={classes.input}
                        label="Name"
                        // variant="outlined"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        className={classes.input}
                        label="Description"
                        // variant="outlined"
                        name="description"
                        value={formState.description}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        className={classes.input}
                        label="Price"
                        // variant="outlined"
                        name="price"
                        type="number"
                        value={formState.price}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        className={classes.input}
                        label="Quantity"
                        // variant="outlined"
                        name="quantity"
                        type="number"
                        value={formState.quantity}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        className={classes.input}
                        label="Zipcode"
                        // variant="outlined"
                        name="zipcode"
                        type="number"
                        value={formState.zipcode}
                        onChange={handleChange}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                    >
                        Update Product
                    </Button>
                </form>
                {updateError && <Typography color="error">Error updating product</Typography>}
            </Paper>
        </Container>
    );
}

export default EditProductPage;