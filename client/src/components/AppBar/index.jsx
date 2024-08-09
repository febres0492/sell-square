import Auth from "../../utils/auth";
import React from 'react';
import { Link } from 'react-router-dom';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

const MyComponent = ({ open, handleDrawerOpen }) => {
    const loggedIn = Auth.loggedIn();
    console.log(c.red,'loggedIn', loggedIn);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Sell Square</Link>
                <div className="navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {loggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/accountSettings">Account</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/" onClick={Auth.logout}>Logout</Link>
                                </li>
                            </>
                        )}
                        {!loggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/signup">Signup</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default MyComponent;