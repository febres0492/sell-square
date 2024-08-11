import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
// import ifLoggedIn from '../utils/ifLoggedIn';
// import { QUERY_USER, QUERY_USER_PRODUCTS, QUERY_CONVERSATIONS } from '../utils/queries';
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from '../components/Products';
import AddProduct from '../components/AddProduct'; 
import Conversations from '../components/Conversations';
import AccountSettings from '../components/AccountSettings';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

const Dashboard = () => {

    const [showComponent, setShowComponent] = useState('products');

    const selectComponent = (e) => {
        setShowComponent(e.target.name);
        const buttons = document.querySelectorAll('.sub-component-btn')
        buttons.forEach((btn) => btn.classList.remove('cat-btn'))
        e.target.classList.add('cat-btn')
    }

    return (
        <div className="container-fluid df gap-4">
            <div className="container-fluid pt-3">
                <div className="df gap-3">
                    <button className="sub-component-btn btn-1 m-0 bg-l1" name="products" onClick={selectComponent}> Products </button>
                    <button className="sub-component-btn btn-1 m-0 bg-l1" name="conversations" onClick={selectComponent}> Conversations </button>
                    <button className="sub-component-btn btn-1 m-0 bg-l1" name="accountSettings" onClick={selectComponent}> Account Settings </button>
                    <button className="sub-component-btn btn-1 m-0 bg-l1" name="addProduct" onClick={selectComponent}> Add Product </button>
                </div>
            </div>
            {showComponent === 'products' && <Products />}
            {showComponent === 'conversations' && <Conversations />}
            {showComponent === 'addProduct' && <AddProduct />} 
            {showComponent === 'accountSettings' && <AccountSettings />} 
        </div>
    );
};

export default Dashboard;