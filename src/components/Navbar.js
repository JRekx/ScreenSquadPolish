/**
 * Navbar component renders a navigation bar with links to different routes.
 * Depending on whether a user is logged in or not, it conditionally displays
 * different links and options.
 * 
 * When a user is logged in (determined by the presence of a token in localStorage):
 * - Displays links to Profile and Search Movies pages.
 * - Provides a Logout button that removes the token from localStorage and navigates to the Login page.
 * 
 * When a user is not logged in:
 * - Displays links to Register and Login pages.
 * 
 * This component uses react-router-dom's Link for navigation and useNavigate hook for programmatic navigation.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    /**
     * Handles user logout by removing the authentication token from localStorage
     * and redirecting the user to the Login page.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg">
                <Link className="navbar-brand" to="/">
                    <img src="/DarkModeSS.webp" alt="Logo" style={{ width: '150px', height: '150px' }} />
                </Link>            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto">
                    {localStorage.getItem('token') ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/search-movies">Search Movies</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Register</Link>
                            </li>
                            <li class="nav-item">
                                <Link className="nav-link" to="/login">Login</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
