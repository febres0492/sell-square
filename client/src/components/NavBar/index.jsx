import Auth from "../../utils/auth";
import React from 'react';
import { Link } from 'react-router-dom';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

const NavBar = ({ open, handleDrawerOpen }) => {
    const loggedIn = Auth.loggedIn();
    console.log(c.red,'loggedIn', loggedIn);

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-d4 px-4">
            <Link className="navbar-brand" to="/">Sell Square</Link>
            {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button> */}
            <div className="df jcfe navbar-collapse column-gap-3 row-gap-2" id="navbarNav">
                <Link to="/"> <button className="btn-1 m-0 bg-l1">Home</button> </Link>
                {loggedIn && (
                    <>
                        <Link to="/dashboard"> 
                            <button className="btn-1 m-0 bg-l1">Dashboard</button> 
                        </Link>
                        <Link to="/" onClick={Auth.logout} className="ml-auto">
                            <button className="btn-1 m-0 bg-l1">Logout</button> 
                        </Link>
                    </>
                )}
                {!loggedIn && (
                    <>
                        <Link to="/signup"> 
                            <button className="btn-1 m-0 bg-l1">Signup</button> 
                        </Link>
                        <Link to="/login">
                            <button className="btn-1 m-0 bg-c1">Login</button> 
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;