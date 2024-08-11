import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT } from '../../utils/mutations';
import { Link, useNavigate } from 'react-router-dom';
import useFetchCategories from '../../utils/useFetchCategories';
import { uploadImage } from '../../utils/helpers';

const AddProduct = () => {
    const { loadingCat, categories } = useFetchCategories();
    const [product, setProduct] = useState({
        name: '', description: '', price: '', quantity: '', category: '', zipcode: '', image: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [addProduct, { data, loading, error }] = useMutation(ADD_PRODUCT);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setProduct({ ...product, [name]: type === 'number' ? parseFloat(value) : value });
    };

    const handleFileChange = (e) => { setImageFile(e.target.files[0]); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = '';
            if (imageFile) { imageUrl = await uploadImage(imageFile); }

            const variables = Object.keys(product).reduce((acc, key) => ({ ...acc, [key]: product[key] }), {});
            variables.image = imageUrl;

            const poduct = await addProduct({ variables })
            console.log('new product', poduct);

            // redirecting to productDetailsPage
            navigate(`/products/${poduct.data.addProduct._id}`);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container my-1">
            <h1>Add Product</h1>
            <form className='d-flex flex-column' onSubmit={handleSubmit} >
                <input type="text" name="name" placeholder="Name" value={product.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} required rows="4" />
                <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
                <input type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} required />
                <select name="category" value={product.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input type="text" name="zipcode" placeholder="Zipcode" value={product.zipcode} onChange={handleChange} required />
                <label>Product Image</label>
                <input type="file" name="image" onChange={handleFileChange} />
                <button className="btn-1 bg-c1" type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </button>
                {error && <p>Error: {error.message}</p>}
            </form>
            {data && <p>Product added successfully!</p>}
        </div>
    );
};

export default AddProduct;