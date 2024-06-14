import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [savedMovies, setSavedMovies] = useState([]);
    const [savedTVShows, setSavedTVShows] = useState([]);
    const [watching, setWatching] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/profile', {
                        headers: { 'Authorization': token }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error(err);
                }
            } else {
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        const fetchSavedMovies = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/saved-movies', {
                        headers: { 'Authorization': token }
                    });
                    setSavedMovies(res.data.sort((a, b) => b.rating - a.rating));
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchSavedMovies();
    }, []);

    useEffect(() => {
        const fetchSavedTVShows = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/saved-tv-shows', {
                        headers: { 'Authorization': token }
                    });
                    setSavedTVShows(res.data.sort((a, b) => b.rating - a.rating));
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchSavedTVShows();
    }, []);

    useEffect(() => {
        const fetchWatching = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/saved-watching', {
                        headers: { 'Authorization': token }
                    });
                    setWatching(res.data.sort((a, b) => b.rating - a.rating));
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchWatching();
    }, []);

    const showTrailer = async (id, type) => {
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=0603d4df389e281cd4338b1fb04ca1b5`);
            const trailer = res.data.results.find(video => video.type === 'Trailer');
            if (trailer) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
            } else {
                alert('Trailer not available');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteItem = async (id, type) => {
        const token = localStorage.getItem('token');
        try {
            const endpoint = type === 'movie' ? 'delete-movie' : type === 'tv' ? 'delete-tv-show' : 'delete-watching';
            await axios.delete(`http://localhost:5000/api/auth/${endpoint}/${id}`, {
                headers: { 'Authorization': token }
            });
            if (type === 'movie') {
                setSavedMovies(savedMovies.filter(movie => movie.movie_id !== id));
            } else if (type === 'tv') {
                setSavedTVShows(savedTVShows.filter(tvShow => tvShow.tv_show_id !== id));
            } else {
                setWatching(watching.filter(item => item.id !== id));
            }
            alert(`${type === 'movie' ? 'Movie' : type === 'tv' ? 'TV Show' : 'Item'} deleted successfully`);
        } catch (err) {
            console.error(err);
            alert(`Error deleting ${type === 'movie' ? 'movie' : type === 'tv' ? 'tv show' : 'item'}`);
        }
    };

    const updateRating = async (id, rating, type) => {
        const token = localStorage.getItem('token');
        try {
            const endpoint = type === 'movie' ? 'update-movie-rating' : type === 'tv' ? 'update-tv-show-rating' : 'update-watching-rating';
            await axios.put(`http://localhost:5000/api/auth/${endpoint}`, {
                [type === 'movie' ? 'movieId' : type === 'tv' ? 'tvShowId' : 'id']: id,
                rating
            }, {
                headers: { 'Authorization': token }
            });
            if (type === 'movie') {
                setSavedMovies(savedMovies.map(movie =>
                    movie.movie_id === id ? { ...movie, rating } : movie
                ).sort((a, b) => b.rating - a.rating));
            } else if (type === 'tv') {
                setSavedTVShows(savedTVShows.map(tvShow =>
                    tvShow.tv_show_id === id ? { ...tvShow, rating } : tvShow
                ).sort((a, b) => b.rating - a.rating));
            } else {
                setWatching(watching.map(item =>
                    item.id === id ? { ...item, rating } : item
                ).sort((a, b) => b.rating - a.rating));
            }
            alert('Rating updated successfully');
        } catch (err) {
            console.error(err);
            alert('Error updating rating');
        }
    };

    const uploadProfilePicture = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token
                }
            });
            setUser({ ...user, profile_picture: res.data.profile_picture });
            alert('Profile picture updated successfully');
        } catch (err) {
            console.error(err);
            alert('Error uploading profile picture');
        }
    };

    return (
        <div className="container">
            {user ? (
                <div>
                    <h2>{user.username}</h2>
                    <div className="row">
                        <div className="col-md-8">
                            <p>Email: {user.email}</p>
                            <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                            <h3>Saved Movies</h3>
                            <div className="row">
                                {savedMovies.map((movie, index) => (
                                    <div key={movie.id} className="col-md-4 mb-4">
                                        <div className="card">
                                            {movie.poster_path ? (
                                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} className="card-img-top" alt={movie.title} />
                                            ) : (
                                                <img src="https://via.placeholder.com/200" className="card-img-top" alt="No poster" />
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">{movie.title}</h5>
                                                <div className="rating" style={{ fontSize: '1.5rem', color: '#ff66cc', textAlign: 'center' }}>
                                                    {movie.rating}/10
                                                </div>
                                                <div className="form-group">
                                                    <label>Update Rating</label>
                                                    <input type="number" className="form-control" min="1" max="10" defaultValue={movie.rating} onChange={(e) => updateRating(movie.movie_id, parseInt(e.target.value), 'movie')} />
                                                </div>
                                                <button onClick={() => showTrailer(movie.movie_id, 'movie')} className="btn btn-secondary mr-2">Show Trailer</button>
                                                <button onClick={() => deleteItem(movie.movie_id, 'movie')} className="btn btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h3>Saved TV Shows</h3>
                            <div className="row">
                                {savedTVShows.map((tvShow, index) => (
                                    <div key={tvShow.id} className="col-md-4 mb-4">
                                        <div className="card">
                                            {tvShow.poster_path ? (
                                                <img src={`https://image.tmdb.org/t/p/w200${tvShow.poster_path}`} className="card-img-top" alt={tvShow.title} />
                                            ) : (
                                                <img src="https://via.placeholder.com/200" className="card-img-top" alt="No poster" />
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">{tvShow.title}</h5>
                                                <div className="rating" style={{ fontSize: '1.5rem', color: '#ff66cc', textAlign: 'center' }}>
                                                    {tvShow.rating}/10
                                                </div>
                                                <div className="form-group">
                                                    <label>Update Rating</label>
                                                    <input type="number" className="form-control" min="1" max="10" defaultValue={tvShow.rating} onChange={(e) => updateRating(tvShow.tv_show_id, parseInt(e.target.value), 'tv')} />
                                                </div>
                                                <button onClick={() => showTrailer(tvShow.tv_show_id, 'tv')} className="btn btn-secondary mr-2">Show Trailer</button>
                                                <button onClick={() => deleteItem(tvShow.tv_show_id, 'tv')} className="btn btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h3>What I am Watching</h3>
                            <div className="row">
                                {watching.map((item, index) => (
                                    <div key={item.id} className="col-md-4 mb-4">
                                        <div className="card">
                                            {item.poster_path ? (
                                                <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} className="card-img-top" alt={item.title} />
                                            ) : (
                                                <img src="https://via.placeholder.com/200" className="card-img-top" alt="No poster" />
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">{item.title}</h5>
                                                <div className="rating" style={{ fontSize: '1.5rem', color: '#ff66cc', textAlign: 'center' }}>
                                                    {item.rating}/10
                                                </div>
                                                <div className="form-group">
                                                    <label>Update Rating</label>
                                                    <input type="number" className="form-control" min="1" max="10" defaultValue={item.rating} onChange={(e) => updateRating(item.id, parseInt(e.target.value), item.type)} />
                                                </div>
                                                <button onClick={() => showTrailer(item.id, item.type)} className="btn btn-secondary mr-2">Show Trailer</button>
                                                <button onClick={() => deleteItem(item.id, item.type)} className="btn btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-4">
                            {user.profile_picture && (
                                <div className="profile-picture">
                                    <img src={`http://localhost:5000${user.profile_picture}`} alt="Profile" className="img-thumbnail" />
                                </div>
                            )}
                            <form onSubmit={uploadProfilePicture}>
                                <div className="form-group">
                                    <label>Upload Profile Picture</label>
                                    <input type="file" className="form-control-file" onChange={(e) => setProfilePicture(e.target.files[0])} />
                                </div>
                                <button type="submit" className="btn btn-primary">Upload</button>
                            </form>
                            {trailerUrl && (
                                <div className="embed-responsive" style={{ paddingBottom: '112.5%', height: '0', position: 'relative' }}>
                                    <iframe className="embed-responsive-item" src={trailerUrl} allowFullScreen title="Trailer" style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0' }}></iframe>
                                </div>
                            )}
                            <div className="text-center mt-4">
                                <img src="/ScreenSquadMuchies.webp" alt="Profile Graphic" style={{ width: '100%', height: '100%', maxWidth: '600px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
