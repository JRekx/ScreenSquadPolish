/**
 * @file routes/authRoutes.js
 * @description This file contains the routing definitions for user authentication and content management
 * including registration, login, profile management, and saving/deleting/updating movies, TV shows, 
 * and watching lists for users. It uses Express.js for handling HTTP requests and relies on an 
 * authentication middleware to protect certain routes.
 * 
 * @requires express
 * @requires ../controllers/authController
 * @requires ../middleware/authMiddleware
 */


const express = require('express');
const { 
    register, 
    login, 
    profile, 
    saveMovie, 
    getSavedMovies, 
    deleteMovie, 
    updateMovieRating, 
    uploadProfilePicture,
    saveTVShow,
    getSavedTVShows,
    deleteTVShow,
    updateTVShowRating,
    getSavedWatching,
    saveWatching,
    deleteWatching,
    updateWatchingRating
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @route POST /register
 * @description Register a new user.
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /login
 * @description Login an existing user.
 * @access Public
 */
router.post('/login', login);

/**
 * @route GET /profile
 * @description Get the profile of the logged-in user.
 * @access Private
 */
router.get('/profile', authMiddleware, profile);

/**
 * @route POST /upload-profile-picture
 * @description Upload a profile picture for the logged-in user.
 * @access Private
 */
router.post('/upload-profile-picture', authMiddleware, uploadProfilePicture);

/**
 * @route POST /save-movie
 * @description Save a movie to the user's favorites.
 * @access Private
 */
router.post('/save-movie', authMiddleware, saveMovie);

/**
 * @route GET /saved-movies
 * @description Get all saved movies of the logged-in user.
 * @access Private
 */
router.get('/saved-movies', authMiddleware, getSavedMovies);

/**
 * @route DELETE /delete-movie/:movieId
 * @description Delete a movie from the user's favorites.
 * @access Private
 */
router.delete('/delete-movie/:movieId', authMiddleware, deleteMovie);

/**
 * @route PUT /update-movie-rating
 * @description Update the rating of a saved movie for the logged-in user.
 * @access Private
 */
router.put('/update-movie-rating', authMiddleware, updateMovieRating);

router.post('/save-tv-show', authMiddleware, saveTVShow);
router.get('/saved-tv-shows', authMiddleware, getSavedTVShows);
router.put('/update-tv-show-rating', authMiddleware, updateTVShowRating);
router.delete('/delete-tv-show/:id', authMiddleware, deleteTVShow);

router.post('/save-watching', authMiddleware, saveWatching);
router.get('/saved-watching', authMiddleware, getSavedWatching);
router.put('/update-watching-rating', authMiddleware, updateWatchingRating);
router.delete('/delete-watching/:id', authMiddleware, deleteWatching);

module.exports = router;
