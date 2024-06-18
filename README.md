ScreenSquad:
-ScreenSquad is a web application that allows users to search for movies and TV shows, watch trailers, save their favorite movies and TV shows, and manage their profile.
-The application uses React for the frontend, Node.js and Express for the backend, and PostgreSQL for the database. 
-It also integrates with the TMDb API for movie and TV show data.

Technologies Used
Frontend: React, Bootstrap
Backend: Node.js, Express
Database: PostgreSQL
External API: TMDb API
Setup and Installation
Prerequisites
Node.js
PostgreSQL
TMDb API key

Features:
-User authentication (register, login, logout)
-Profile management with profile picture upload
-Search for movies and TV shows using the TMDb API
-Watch trailers for movies and TV shows
-Save favorite movies and TV shows
-Manage a "What I'm Watching" section
-Rate movies and TV shows
-Delete saved movies and TV shows

Installation:
Clone the repository:
git clone <repository_url>
cd ScreenSquad

Install dependencies:
npm install
cd client
npm install
cd ..

Set up PostgreSQL database:

Create a new PostgreSQL database called screensquad.
Update the userModel.js file with your PostgreSQL credentials.

const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'screensquad',
    password: 'your_db_password',
    port: 5432,
});


Create database tables:

Run the following SQL commands to create the necessary tables:

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS tv_shows CASCADE;
DROP TABLE IF EXISTS watching CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    rating INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tv_shows (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    tv_show_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    rating INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE watching (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    item_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    poster_path VARCHAR(255),
    type VARCHAR(50) NOT NULL,
    rating INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

Set up environment variables:

Create a .env file in the root directory and add your TMDb API key and JWT secret:
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=your_jwt_secret


Start the development server:
npm run dev


Usage
Register a new account:

Open the application in your browser.
Navigate to the Register page and create a new account.
Login:

Navigate to the Login page and log in with your credentials.
Profile Management:

Upload a profile picture.
View and manage your saved movies and TV shows.
Rate and delete items from your "What I'm Watching" section.
Search for Movies and TV Shows:

Use the search functionality to find movies and TV shows.
Watch trailers directly in the application.
Save your favorite movies and TV shows.

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

License
This project is licensed under the MIT License.

Contact
For any inquiries or issues, please contact [ruizjordanjames@gmail.com].









