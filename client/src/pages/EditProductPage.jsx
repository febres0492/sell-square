import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PRODUCT, DELETE_PRODUCT } from '../utils/mutations';
import { QUERY_PRODUCT_BY_ID } from '../utils/queries';
import { TextField, Button, Typography, Container, Paper, Card, CardMedia, Box } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { uploadImage, deleteImage } from '../utils/helpers';
import { showModal } from '../components/Modal';

function EditProductPage() {
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
    const [deleteProduct] = useMutation(DELETE_PRODUCT);

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
        const preFile = e.target.files[0];
        const nameWithoutExtension = preFile.name.split('.')[0];
        const newFile = new File([preFile], nameWithoutExtension, {
            type: preFile.type,
            lastModified: preFile.lastModified,
        });
    
        setImageFile(newFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormState({ ...formState, image: reader.result });
        };
        reader.readAsDataURL(newFile);
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

    const handleDelete = async () => {
        const confirm = await showModal('Are you sure you want to delete this product?', 
            {type: 'confirm'}
        )
        if (!confirm) return;
        try {
            if (data.product.image) {
                const res = await deleteImage(data.product.image);
                console.log('delete image response:', res);
                setFormState({ ...formState, image: '' });
            }
            const deletedProduct = await deleteProduct({ variables: { id } });
            console.log('deleted product:', deletedProduct);
            navigate('/dashboard');
        } catch (e) {
            console.error('Error deleting product:', e);
        }
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
            <Paper sx={{ marginTop: 4, padding: 2 }}>
                <Link to={`/products/${id}`}>
                    <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
                        ← Product Page
                    </Button>
                </Link>
                <Typography variant="h4" gutterBottom>
                    Update Product
                </Typography>
                <Card sx={{ marginBottom: 4 }}>
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
                    <Button variant="contained" color="primary" component="span" sx={{ marginBottom: 2 }}>
                        Change Image
                    </Button>
                </label>
                <form onSubmit={handleFormSubmit}>
                    {fields.map((field) => (
                        <TextField
                            key={field.name} sx={{ marginBottom: 2 }} label={field.label} name={field.name}
                            type={field.type} value={formState[field.name]} onChange={handleChange} required
                        />
                    ))}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Save Changes
                        </Button>
                        <Button type="button" variant="contained" color="secondary" onClick={handleDelete}>
                            Delete Product
                        </Button>
                    </Box>
                </form>
                {updateError && <Typography color="error">Error updating product</Typography>}
            </Paper>
        </Container>
    );
}

export default EditProductPage;