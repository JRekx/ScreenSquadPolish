import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Register component for user registration.
 * @returns {JSX.Element} The rendered component.
 */
const Register = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Destructure form data state
    const { username, email, password } = formData;
    
    // Hook to navigate programmatically
    const navigate = useNavigate();

    /**
     * Handles input change and updates form data state.
     * @param {object} e - The event object.
     */
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    /**
     * Handles form submission.
     * @param {object} e - The event object.
     */
    const onSubmit = async e => {
        e.preventDefault();  // Prevent form from submitting the default way
        try {
            // Send POST request to register the user
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            console.log(res.data);  // Log response data
            navigate('/login');  // Redirect to login page
        } catch (err) {
            console.error(err.response.data);  // Log error response data
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="username" 
                        value={username} 
                        onChange={onChange} 
                        required 
                    />
                </div>
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
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            
        </div>
    );
};

export default Register;
