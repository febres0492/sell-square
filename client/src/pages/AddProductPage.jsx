import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT } from '../utils/mutations';
import { Link } from 'react-router-dom';

const AddProductPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [category, setCategory] = useState('');

    const [addProduct, { data, loading, error }] = useMutation(ADD_PRODUCT);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addProduct({
                variables: {
                    name,
                    description,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    category
                }
            });
            // Optionally, reset the form or show a success message
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Link to="/">← Back to Products</Link>
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Category ID"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Product'}
                </button>
                {error && <p>Error: {error.message}</p>}
            </form>
            {data && <p>Product added successfully!</p>}
        </div>
    );
};

export default AddProductPage;