import Auth from "../../utils/auth";
import React from 'react';
import { Link } from 'react-router-dom';

const c = { red: '\x1b[31m%s\x1b[0m', green: '\x1b[32m%s\x1b[0m', yellow: '\x1b[33m%s\x1b[0m' };

const NavBar = ({ open, handleDrawerOpen }) => {
    const loggedIn = Auth.loggedIn();
    console.log(c.red,'loggedIn', loggedIn);

    return (
        <nav class="navbar navbar-expand-sm navbar-dark bg-d4 px-4">
            <Link className="navbar-brand" to="/">Sell Square</Link>
            {/* <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button> */}
            <div class="df jcc navbar-collapse column-gap-3 row-gap-2" id="navbarNav">
                <Link to="/"> <button className="btn-1 m-0 bg-l1">Home</button> </Link>
                {loggedIn && (
                    <>
                        <Link to="/dashboard"> 
                            <button className="btn-1 m-0 bg-l1">Dashboard</button> 
                        </Link>
                        <Link to="/accountSettings"> 
                            <button className="btn-1 m-0 bg-l1">Account</button> 
                        </Link>
                        <Link to="/" onClick={Auth.logout}>
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
                {/* <ul class="navbar-nav">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Features</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Pricing</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" href="#">Disabled</a>
                    </li>
                </ul> */}
            </div>
        </nav>
        // <nav className="navbar navbar-expand-lg navbar-light bg-d4">
        //     <div className="container-fluid">
        //         <div className="col d-flex">
        //             <Link className="navbar-brand" to="/">Sell Square</Link>
        //             <div className="navbar-collapse df jcfe">
        //                 <div className="df jcfe">
        //                     <Link to="/"> 
        //                         <button className="btn-1 bg-l1">Home</button> 
        //                     </Link>
        //                     {loggedIn && (
        //                         <>
        //                             <Link to="/dashboard"> 
        //                                 <button className="btn-1 bg-l1">Dashboard</button> 
        //                             </Link>
        //                             <Link to="/accountSettings"> 
        //                                 <button className="btn-1 bg-l1">Account</button> 
        //                             </Link>
        //                             <Link to="/" onClick={Auth.logout}>
        //                                 <button className="btn-1 bg-l1">Logout</button> 
        //                             </Link>
        //                         </>
        //                     )}
        //                     {!loggedIn && (
        //                         <>
        //                             <Link to="/signup"> 
        //                                 <button className="btn-1 bg-l1">Signup</button> 
        //                             </Link>
        //                             <Link to="/login">
        //                                 <button className="btn-1 bg-c1">Login</button> 
        //                             </Link>
        //                         </>
        //                     )}
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </nav>
    );
};

export default NavBar;