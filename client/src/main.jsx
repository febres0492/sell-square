import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import Home from './pages/Home';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <NoMatch />, 
        children: [
            { index: true, element: <Home /> },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/dashboard/:component/:id', element: <Dashboard /> },
            { path: '/login', element: <Login /> },
            { path: '/signup', element: <Signup /> },
            { path: '/products/:id', element: <ProductDetailsPage /> },
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
);