// server/server.js

// Import required modules
const express = require('express'); // Framework for building web applications
const bodyParser = require('body-parser'); // Middleware for parsing incoming request bodies
const cors = require('cors'); // Middleware for enabling Cross-Origin Resource Sharing
const path = require('path'); // Module for working with file and directory paths
const authRoutes = require('./routes/authRoutes'); // Routes for authentication
const { pool } = require('./models/userModel'); // Database connection pool

// Initialize express application
const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse incoming JSON requests

// Route for authentication
app.use('/api/auth', authRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
