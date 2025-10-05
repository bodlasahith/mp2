import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import { Movie, Genre } from '../types/movie';
import './GalleryView.css';

const GalleryView: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGenres();
    loadPopularMovies();
  }, []);

  const loadGenres = async () => {
    try {
      const genreList = await movieService.getGenres();
      setGenres(genreList);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadPopularMovies = async () => {
    setLoading(true);
    try {
      const response = await movieService.getPopularMovies();
      setMovies(response.results);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
    setLoading(false);
  };

  const handleGenreFilter = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const filteredMovies = movies.filter(movie => {
    if (selectedGenres.length === 0) return true;
    return selectedGenres.some(genreId => movie.genre_ids.includes(genreId));
  });

  return (
    <div className="gallery-view">
      <div className="gallery-header">
        <h1>Movie Gallery</h1>
        <div className="genre-filters">
          <h3>Filter by Genre:</h3>
          <div className="genre-buttons">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreFilter(genre.id)}
                className={`genre-button ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movie-gallery">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="gallery-item">
              <img
                src={movieService.getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="gallery-poster"
              />
              <div className="gallery-overlay">
                <h4>{movie.title}</h4>
                <p>⭐ {movie.vote_average.toFixed(1)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryView;