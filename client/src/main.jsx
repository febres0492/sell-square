import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import Home from './pages/Home';
import Detail from './pages/Detail';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Success from './pages/Success';
import OrderHistory from './pages/OrderHistory';
import AccountSettings from './pages/AccountSettings';
import AddProductPage from './pages/AddProductPage';



const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        error: <NoMatch />,
        children: [
            { index: true, element: <Home /> },
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <Signup /> },
            { path: '/success', element: <Success /> },
            { path: '/orderHistory', element: <OrderHistory /> },
            { path: '/accountSettings', element: <AccountSettings /> },
            { path: '/add-product', element: <AddProductPage /> },
            { path: '/products/:id', element: <Detail /> }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
