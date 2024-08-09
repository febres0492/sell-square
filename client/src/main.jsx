import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import Home from './pages/Home';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Success from './pages/Success';
// import OrderHistory from './pages/OrderHistory';
import AccountSettings from './pages/AccountSettings';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
// import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ConversationPage from './pages/ConversationPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        error: <NoMatch />,
        children: [
            { index: true, element: <Home /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <Signup /> },
            { path: '/success', element: <Success /> },
            // { path: '/orderHistory', element: <OrderHistory /> },
            { path: '/accountSettings', element: <AccountSettings /> },
            { path: '/add-product', element: <AddProductPage /> },
            { path: '/edit-product/:id', element: <EditProductPage /> },
            { path: '/products/:id', element: <ProductDetailsPage /> },
            { path: '/conversation/:id', element: <ConversationPage /> }

        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
