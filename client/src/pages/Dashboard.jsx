import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from '../components/Products';
import ProductDetails from '../components/ProductDetails';
import AddProduct from '../components/AddProduct'; 
import Conversations from '../components/Conversations';
import AccountSettings from '../components/AccountSettings';
import OpenConversation from '../components/OpenConversation';
import EditProduct from '../components/EditProduct';

const Dashboard = () => {
    const [showComponent, setShowComponent] = useState('Products');
    const [selectedId, setSelectedId] = useState(null);

    const selectButton = (name) => {
        document.querySelectorAll('.sub-component-btn').forEach((btn) => {
            btn.classList.remove('cat-btn');
            btn.name === name ? btn.classList.add('cat-btn') : null;
        });
    };

    const selectComponent = (args) => {
        const { e, component, id } = args;
        
        setShowComponent(component);
        setSelectedId(id || null);
        selectButton(component);
    };

    selectButton(showComponent);

    const components = {
        Products: <Products selectComponent={selectComponent} />,
        AddProduct: <AddProduct selectComponent={selectComponent} />,
        ProductDetails: <ProductDetails selectComponent={selectComponent} id={selectedId} />,
        EditProduct: <EditProduct selectComponent={selectComponent} id={selectedId} />,
        Conversations: <Conversations selectComponent={selectComponent} />,
        AccountSettings: <AccountSettings selectComponent={selectComponent} />,
        OpenConversation: <OpenConversation selectComponent={selectComponent} id={selectedId}/>
    };

    return (
        <div className="container-fluid df gap-4">
            <div className="container-fluid pt-3">
                <div className="d-flex gap-3 overflow-x scrollbar p-2 rounded bg-d1">
                    <button name="Products" className="sub-component-btn btn-1 m-0 bg-l1" 
                        onClick={(e) => selectComponent({ e, component: 'Products' })}> Products 
                    </button>
                    <button name="Conversations" className="sub-component-btn btn-1 m-0 bg-l1" 
                        onClick={(e) => selectComponent({ e, component: 'Conversations' })}> Conversations 
                    </button>
                    <button name="AccountSettings" className="sub-component-btn btn-1 m-0 bg-l1" 
                        onClick={(e) => selectComponent({ e, component: 'AccountSettings' })}> Account Settings 
                    </button>
                    <button name="AddProduct" className="sub-component-btn btn-1 m-0 bg-l1" 
                        onClick={(e) => selectComponent({ e, component: 'AddProduct' })}> Add Product 
                    </button>
                </div>
            </div>
            {components[showComponent]}
        </div>
    );
};

export default Dashboard;