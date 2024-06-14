// models/userModel.js

/**
 * This module sets up a connection pool to a PostgreSQL database using the 'pg' library.
 * The pool allows multiple clients to reuse the same database connection, improving efficiency.
 */

const { Pool } = require('pg');

// Create a new connection pool to the PostgreSQL database
const pool = new Pool({
    user: 'postgres',      
    host: 'localhost',     
    database: 'screensquad', 
    password: 'password',  
    port: 5432,           
});

// Export the pool to be used in other parts of the application
module.exports = pool;
