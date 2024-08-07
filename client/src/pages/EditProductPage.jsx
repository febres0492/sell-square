import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PRODUCT } from '../utils/mutations';
import { QUERY_PRODUCT_BY_ID } from '../utils/queries';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, Container, Paper, Card, CardMedia } from '@material-ui/core';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { uploadImage } from '../utils/helpers';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(4),
        padding: theme.spacing(2),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: { marginBottom: theme.spacing(2), },
    button: { marginBottom: theme.spacing(2), },
}));

function EditProductPage() {
    const classes = useStyles();
    const navigate = useNavigate();
    const { id } = useParams();
    const [imageFile, setImageFile] = useState(null);

    const { loading, data, error } = useQuery(QUERY_PRODUCT_BY_ID, {
        variables: { id },
    });

    const [formState, setFormState] = useState({
        name: '', description: '', price: '', quantity: '', image: '', zipcode: '',
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
        setFormState({ ...formState, [name]: type === 'number' ? parseInt(value) : value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormState({ ...formState, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            if (imageFile) {
                const imageUrl = await uploadImage(imageFile);
                formState.image = imageUrl;
            }
            await updateProduct({ variables: { id, ...formState } });
            navigate(`/products/${id}`);
        } catch (e) {
            console.error(e, updateError);
        }
    };

    const handleDelete = () => {
        console.log('Product ID:', data.product._id);
        console.log('image', data.product.image);
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading product</Typography>;

    const product = data.product || {};

    const fields = [
        { label: "Name", name: "name", type: "text" },
        { label: "Description", name: "description", type: "text" },
        { label: "Price", name: "price", type: "number" },
        { label: "Quantity", name: "quantity", type: "number" },
        { label: "Zipcode", name: "zipcode", type: "number" }
    ];

    return (
        <Container maxWidth="md">
            <Paper className={classes.container}>
                <Link to={`/products/${id}`} className={classes.button}>
                    <Button variant="contained" color="primary" className={classes.button}>
                        ← Product Page
                    </Button>
                </Link>
                <Typography variant="h4" gutterBottom>
                    Update Product
                </Typography>
                <Card className="mb-4">
                    {formState.image && (
                        <CardMedia
                            component="img" alt={product.name} height="140" image={formState.image} title={product.name}
                        />
                    )}
                </Card>
                <input accept="image/*" style={{ display: 'none' }} id="upload-image" type="file"
                    name="image" onChange={handleImageChange} required
                />
                <label htmlFor="upload-image">
                    <Button variant="contained" color="primary" component="span" className={classes.button}>
                        Change Image
                    </Button>
                </label>
                <form className={classes.form} onSubmit={handleFormSubmit}>
                    {fields.map((field) => (
                        <TextField
                            key={field.name} className={classes.input} label={field.label} name={field.name}
                            type={field.type} value={formState[field.name]} onChange={handleChange} required
                        />
                    ))}
                    <Button type="submit" variant="contained" color="primary" className={classes.button} >
                        Save Changes
                    </Button>
                    <Button type="button" variant="contained" color="secondary" className={classes.button} onClick={handleDelete}>
                        Delete Product
                    </Button>
                </form>
                {updateError && <Typography color="error">Error updating product</Typography>}
            </Paper>
        </Container>
    );
}

export default EditProductPage;