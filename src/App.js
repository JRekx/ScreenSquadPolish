// App.js

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import SearchMovies from './components/SearchMovies';

/**
 * App Component
 * The root component of the application that sets up the main structure and routing.
 * 
 * @returns {JSX.Element} The main app component.
 */
function App() {
    return (
        <div className="container">
            {/* Navbar Component */}
            <Navbar />
            {/* Routes for navigating between different components */}
            <Routes>
                {/* Route to Register component */}
                <Route path="/register" element={<Register />} />
                {/* Route to Login component */}
                <Route path="/login" element={<Login />} />
                {/* Route to Profile component */}
                <Route path="/profile" element={<Profile />} />
                {/* Route to SearchMovies component */}
                <Route path="/search-movies" element={<SearchMovies />} />
                {/* Default route redirects to Login component */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;
