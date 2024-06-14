import React, { useState } from 'react';
import axios from 'axios';

const SearchMovies = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [filter, setFilter] = useState('all');
    const [genre, setGenre] = useState('');

    const searchItems = async (e) => {
        e.preventDefault();
        
        let url = '';
        if (filter === 'all') {
            url = `https://api.themoviedb.org/3/search/multi?api_key=0603d4df389e281cd4338b1fb04ca1b5&query=${query}`;
        } else if (filter === 'movie') {
            url = `https://api.themoviedb.org/3/search/movie?api_key=0603d4df389e281cd4338b1fb04ca1b5&query=${query}`;
        } else if (filter === 'tv') {
            url = `https://api.themoviedb.org/3/search/tv?api_key=0603d4df389e281cd4338b1fb04ca1b5&query=${query}`;
        } else if (filter === 'theaters') {
            url = `https://api.themoviedb.org/3/movie/now_playing?api_key=0603d4df389e281cd4338b1fb04ca1b5`;
        } else if (filter === 'streaming') {
            url = `https://api.themoviedb.org/3/movie/popular?api_key=0603d4df389e281cd4338b1fb04ca1b5`;
        } else if (filter === 'genre' && genre) {
            url = `https://api.themoviedb.org/3/discover/movie?api_key=0603d4df389e281cd4338b1fb04ca1b5&with_genres=${genre}`;
        }

        try {
            const res = await axios.get(url);
            setResults(res.data.results);
        } catch (err) {
            console.error(err);
        }
    };

    const saveItem = async (item) => {
        const token = localStorage.getItem('token');
        try {
            const endpoint = filter === 'movie' ? 'save-movie' : 'save-tv-show';
            await axios.post(`http://localhost:5000/api/auth/${endpoint}`, {
                [filter === 'movie' ? 'movieId' : 'tvShowId']: item.id,
                title: item.title || item.name,
                posterPath: item.poster_path
            }, {
                headers: { 'Authorization': token }
            });
            alert(`${filter === 'movie' ? 'Movie' : 'TV Show'} saved successfully`);
        } catch (err) {
            console.error('Error saving item:', err);
            alert(`Error saving ${filter === 'movie' ? 'movie' : 'tv show'}`);
        }
    };

    const saveToWatching = async (item) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/auth/save-watching', {
                id: item.id,
                title: item.title || item.name,
                posterPath: item.poster_path,
                type: filter === 'movie' ? 'movie' : 'tv'
            }, {
                headers: { 'Authorization': token }
            });
            alert(`${filter === 'movie' ? 'Movie' : 'TV Show'} added to What I'm Watching successfully`);
        } catch (err) {
            console.error('Error adding to What I\'m Watching:', err);
            alert(`Error adding ${filter === 'movie' ? 'movie' : 'tv show'} to What I'm Watching`);
        }
    };

    const showTrailer = async (itemId) => {
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/${filter === 'movie' ? 'movie' : 'tv'}/${itemId}/videos?api_key=0603d4df389e281cd4338b1fb04ca1b5`);
            const trailer = res.data.results.find(video => video.type === 'Trailer');
            if (trailer) {
                window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
            } else {
                alert('Trailer not available');
            }
        } catch (err) {
            console.error('Error fetching trailer:', err);
        }
    };

    return (
        <div className="container">
            <div className="text-center mt-4">
                <img src="/ScreenSquadVhs.webp" alt="Search Graphic 1" style={{ width: '25%', height: '25%', maxWidth: '600px' }} />
            </div>
            <h2>Search Movies and TV Shows</h2>
            <form onSubmit={searchItems}>
                <div className="form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Filter By</label>
                    <select 
                        className="form-control" 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="movie">Movies</option>
                        <option value="tv">TV Shows</option>
                        <option value="theaters">Still in Theaters</option>
                        <option value="streaming">On Streaming</option>
                        <option value="genre">Genre</option>
                    </select>
                </div>
                {filter === 'genre' && (
                    <div className="form-group">
                        <label>Genre</label>
                        <select 
                            className="form-control" 
                            value={genre} 
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="">Select Genre</option>
                            <option value="35">Comedy</option>
                            <option value="27">Horror</option>
                            <option value="18">Drama</option>
                            <option value="16">Animated</option>
                        </select>
                    </div>
                )}
                <button type="submit" className="btn btn-primary">Search</button>
            </form>
            <div className="mt-4">
                {results.map(item => (
                    <div key={item.id} className="card mb-3" style={{ maxWidth: '540px' }}>
                        <div className="row no-gutters">
                            <div className="col-md-4">
                                {item.poster_path ? (
                                    <img 
                                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} 
                                        className="card-img" 
                                        alt={item.title || item.name} 
                                    />
                                ) : (
                                    <img 
                                        src="https://via.placeholder.com/200" 
                                        className="card-img" 
                                        alt="No poster" 
                                    />
                                )}
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{item.title || item.name}</h5>
                                    <button 
                                        onClick={() => saveItem(item)} 
                                        className="btn btn-primary mr-2"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onClick={() => saveToWatching(item)} 
                                        className="btn btn-warning mr-2"
                                    >
                                        Add to What I'm Watching
                                    </button>
                                    <button 
                                        onClick={() => showTrailer(item.id)} 
                                        className="btn btn-secondary"
                                    >
                                        Show Trailer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <img src="/ScreenSquadDVD.webp" alt="Search Graphic 2" style={{ width: '25%', height: '25%', maxWidth: '600px' }} />
            </div>
        </div>
    );
};

export default SearchMovies;
