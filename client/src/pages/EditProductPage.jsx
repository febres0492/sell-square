import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { UPDATE_PRODUCT, DELETE_PRODUCT } from '../utils/mutations';
import { QUERY_PRODUCT_BY_ID } from '../utils/queries';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { uploadImage, deleteImage } from '../utils/helpers';
import { showModal } from '../components/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    if (loading) return <div className="alert alert-info">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error loading product</div>;

    const product = data.product || {};

    const fields = [
        { label: "Name", name: "name", type: "text" },
        { label: "Description", name: "description", type: "text" },
        { label: "Price", name: "price", type: "number" },
        { label: "Quantity", name: "quantity", type: "number" },
        { label: "Zipcode", name: "zipcode", type: "number" }
    ];

    return (
        <div className="container mt-4">
            <div className="card p-4">
                <Link to={`/products/${id}`}>
                    <button className="btn btn-primary mb-2">
                        ← Product Page
                    </button>
                </Link>
                <h4 className="mb-4">Update Product</h4>
                <div className="card mb-4">
                    {formState.image && (
                        <img
                            src={formState.image}
                            className="card-img-top"
                            alt={product.name}
                            style={{ height: '140px', objectFit: 'cover' }}
                        />
                    )}
                </div>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-image"
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    required
                />
                <label htmlFor="upload-image">
                    <button className="btn btn-primary mb-2" component="span">
                        Change Image
                    </button>
                </label>
                <form onSubmit={handleFormSubmit}>
                    {fields.map((field) => (
                        <div className="mb-2" key={field.name}>
                            <label className="form-label">{field.label}</label>
                            <input
                                className="form-control"
                                type={field.type}
                                name={field.name}
                                value={formState[field.name]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>
                            Delete Product
                        </button>
                    </div>
                </form>
                {updateError && <div className="alert alert-danger mt-2">Error updating product</div>}
            </div>
        </div>
    );
}

export default EditProductPage;