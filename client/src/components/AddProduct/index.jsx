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
        <div className="container df my-1 jcc">
            <div className='rounded bg-d1 fg df jcc p-3'>
                <div className='card my-4 p-3' style={{maxWidth:'600px'}}>
                    <h1>Add Product</h1>
                    <form className='d-flex flex-column gap-2' onSubmit={handleSubmit} >
                        <div className="border p-2 d-flex flex-column">
                            <input type="text" name="name" placeholder="Name" value={product.name} onChange={handleChange} required />
                            <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} required rows="4" />
                        </div>
                        <div className="df ais gap-2">
                            <input className='border fg' type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
                            <input className='border fg' type="number" name="quantity" placeholder="Quantity" value={product.quantity} onChange={handleChange} required />
                            <select className='border fg' name="category" value={product.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input className='border' type="text" name="zipcode" placeholder="Zipcode" value={product.zipcode} onChange={handleChange} required />
                        <div className='df aic gap-2 p-2 border'>
                            <label>Product Image:</label>
                            <input type="file" name="image" onChange={handleFileChange} />
                        </div>
                        <button className="btn-1 bg-c1" type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                        {error && <p>Error: {error.message}</p>}
                    </form>
                    {data && <p>Product added successfully!</p>}
                </div>
            </div>
        </div>
    );
};

export default AddProduct;