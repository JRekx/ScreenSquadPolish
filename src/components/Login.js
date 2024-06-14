import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Login component handles the user login functionality.
 * 
 * This component allows users to input their email and password,
 * and submit the form to authenticate. On successful login,
 * it stores the authentication token in local storage and navigates to the profile page.
 */
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    const navigate = useNavigate();

    /**
     * Handles changes to the input fields and updates the form data state.
     * 
     * @param {Object} e - The event object from the input field.
     */
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    /**
     * Handles form submission, sends login data to the backend API.
     * 
     * @param {Object} e - The event object from the form submission.
     */
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token); // Store token in local storage
            navigate('/profile'); // Redirect to profile page on successful login
        } catch (err) {
            console.error(err.response.data); // Log error if login fails
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email" 
                        value={email} 
                        onChange={onChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        name="password" 
                        value={password} 
                        onChange={onChange} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
