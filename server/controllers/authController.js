const pool = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

exports.uploadProfilePicture = [upload.single('profilePicture'), async (req, res) => {
    const userId = req.user.userId;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const result = await pool.query(
            'UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING profile_picture',
            [profilePicture, userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}];

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [userId]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.saveMovie = async (req, res) => {
    const { movieId, title, posterPath } = req.body;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'INSERT INTO movies (user_id, movie_id, title, poster_path) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, movieId, title, posterPath]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.saveTVShow = async (req, res) => {
    const { tvShowId, title, posterPath, rating } = req.body;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'INSERT INTO tv_shows (user_id, tv_show_id, title, poster_path, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, tvShowId, title, posterPath, rating]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.saveWatching = async (req, res) => {
    const { id, title, posterPath, type, rating } = req.body;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'INSERT INTO watching (user_id, item_id, title, poster_path, type, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, id, title, posterPath, type, rating]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getSavedMovies = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'SELECT * FROM movies WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getSavedTVShows = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'SELECT * FROM tv_shows WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getSavedWatching = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'SELECT * FROM watching WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateMovieRating = async (req, res) => {
    const { movieId, rating } = req.body;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'UPDATE movies SET rating = $1 WHERE user_id = $2 AND movie_id = $3 RETURNING *',
            [rating, userId, movieId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateTVShowRating = async (req, res) => {
    const { tvShowId, rating } = req.body;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'UPDATE tv_shows SET rating = $1 WHERE user_id = $2 AND tv_show_id = $3 RETURNING *',
            [rating, userId, tvShowId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateWatchingRating = async (req, res) => {
    const { id, rating } = req.body;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'UPDATE watching SET rating = $1 WHERE user_id = $2 AND id = $3 RETURNING *',
            [rating, userId, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMovie = async (req, res) => {
    const userId = req.user.userId;
    const movieId = req.params.movieId;

    try {
        await pool.query(
            'DELETE FROM movies WHERE user_id = $1 AND movie_id = $2',
            [userId, movieId]
        );
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTVShow = async (req, res) => {
    const userId = req.user.userId;
    const tvShowId = req.params.id;

    try {
        await pool.query(
            'DELETE FROM tv_shows WHERE user_id = $1 AND tv_show_id = $2',
            [userId, tvShowId]
        );
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteWatching = async (req, res) => {
    const userId = req.user.userId;
    const id = req.params.id;

    try {
        await pool.query(
            'DELETE FROM watching WHERE user_id = $1 AND id = $2',
            [userId, id]
        );
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
