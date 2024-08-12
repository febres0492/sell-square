import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from '../components/Products';
import ProductDetails from '../components/ProductDetails';
import AddProduct from '../components/AddProduct'; 
import Conversations from '../components/Conversations';
import AccountSettings from '../components/AccountSettings';

const Dashboard = () => {
    const [showComponent, setShowComponent] = useState('Products');

    const selectButton = (name) => {
        document.querySelectorAll('.sub-component-btn').forEach((btn) => {
            btn.classList.remove('cat-btn')
            btn.name === name ? btn.classList.add('cat-btn') : null;
        })
    };

    const selectComponent = (e, component) => {
        setShowComponent(component);
        selectButton(component);
    };

    selectButton(showComponent)

    const components = {
        Products: <Products selectComponent={selectComponent} />,
        AddProduct: <AddProduct selectComponent={selectComponent} />,
        Conversations: <Conversations selectComponent={selectComponent} />,
        AccountSettings: <AccountSettings selectComponent={selectComponent} />,
        ProductDetails: <ProductDetails selectComponent={selectComponent} />
    };

    return (
        <div className="container-fluid df gap-4">
            <div className="container-fluid pt-3">
                <div className="df gap-3">
                    <button name="Products" className="sub-component-btn btn-1 m-0 bg-l1" 
                        onClick={(e) => selectComponent(e, 'Products')}> Products 
                    </button>
                    <button name="Conversations" className="sub-component-btn btn-1 m-0 bg-l1" 
                        onClick={(e) => selectComponent(e, 'Conversations')}> Conversations 
                    </button>
                    <button name="AccountSettings" className="sub-component-btn btn-1 m-0 bg-l1" 
                        onClick={(e) => selectComponent(e, 'AccountSettings')}> Account Settings 
                    </button>
                    <button name="AddProduct" className="sub-component-btn btn-1 m-0 bg-l1" 
                        onClick={(e) => selectComponent(e, 'AddProduct')}> Add Product 
                    </button>
                </div>
            </div>
            {components[showComponent]}
        </div>
    );
};

export default Dashboard;