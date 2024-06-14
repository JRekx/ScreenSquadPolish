/**
 * Middleware to authenticate requests using JSON Web Tokens (JWT).
 *
 * This middleware checks for the presence of a JWT in the `Authorization` header of the request.
 * If a token is found, it verifies the token using the provided secret key. If the token is valid,
 * it decodes the token and attaches the decoded payload to the `req.user` object for use in subsequent
 * middleware or route handlers. If the token is missing or invalid, it returns an appropriate error response.
 *
 * Usage:
 * This middleware should be used in routes where authentication is required.
 * 
 * Example:
 * const authMiddleware = require('./middleware/authMiddleware');
 * app.use('/protectedRoute', authMiddleware, (req, res) => {
 *   res.send('This is a protected route');
 * });
 */

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from Authorization header
    const token = req.header('Authorization');

    // Check if no token is provided
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        // Verify token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        // Attach decoded user to request object
        req.user = decoded;
        // Proceed to next middleware or route handler
        next();
    } catch (error) {
        // Return error response if token is invalid
        res.status(400).json({ error: 'Token is not valid' });
    }
};
