import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movieService';
import { MovieDetails, Movie } from '../types/movie';
import './DetailView.css';

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadMovieDetails(parseInt(id));
      loadAllMovies();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMovieDetails = async (movieId: number) => {
    setLoading(true);
    try {
      const movieDetails = await movieService.getMovieDetails(movieId);
      setMovie(movieDetails);
    } catch (error) {
      console.error('Error loading movie details:', error);
    }
    setLoading(false);
  };

  const loadAllMovies = async () => {
    try {
      const response = await movieService.getPopularMovies();
      setAllMovies(response.results);
      const index = response.results.findIndex(m => m.id === parseInt(id!));
      setCurrentIndex(index >= 0 ? index : 0);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : allMovies.length - 1;
    setCurrentIndex(prevIndex);
    navigate(`/movie/${allMovies[prevIndex].id}`);
  };

  const handleNext = () => {
    const nextIndex = currentIndex < allMovies.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    navigate(`/movie/${allMovies[nextIndex].id}`);
  };

  if (loading || !movie) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="detail-view">
      <div className="detail-header">
        <img
          src={movieService.getBackdropUrl(movie.backdrop_path)}
          alt={movie.title}
          className="backdrop"
        />
        <div className="header-content">
          <img
            src={movieService.getPosterUrl(movie.poster_path)}
            alt={movie.title}
            className="detail-poster"
          />
          <div className="movie-title">
            <h1>{movie.title}</h1>
            <p className="tagline">{movie.tagline}</p>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="movie-info">
          <div className="info-row">
            <span className="label">Release Date:</span>
            <span>{movieService.formatDate(movie.release_date)}</span>
          </div>
          <div className="info-row">
            <span className="label">Runtime:</span>
            <span>{movieService.formatRuntime(movie.runtime)}</span>
          </div>
          <div className="info-row">
            <span className="label">Rating:</span>
            <span>⭐ {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)</span>
          </div>
          <div className="info-row">
            <span className="label">Genres:</span>
            <span>{movie.genres.map(g => g.name).join(', ')}</span>
          </div>
          <div className="info-row">
            <span className="label">Budget:</span>
            <span>{movieService.formatMoney(movie.budget)}</span>
          </div>
          <div className="info-row">
            <span className="label">Revenue:</span>
            <span>{movieService.formatMoney(movie.revenue)}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span>{movie.status}</span>
          </div>
        </div>

        <div className="overview">
          <h3>Overview</h3>
          <p>{movie.overview}</p>
        </div>

        <div className="production-info">
          <h3>Production Companies</h3>
          <div className="companies">
            {movie.production_companies.map(company => (
              <span key={company.id} className="company">
                {company.name}
              </span>
            ))}
          </div>
        </div>

        <div className="production-info">
          <h3>Production Countries</h3>
          <div className="countries">
            {movie.production_countries.map(country => (
              <span key={country.iso_3166_1} className="country">
                {country.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="navigation-buttons">
        <button onClick={handlePrevious} className="nav-button">
          Previous
        </button>
        <span className="navigation-info">
          {currentIndex + 1} of {allMovies.length}
        </span>
        <button onClick={handleNext} className="nav-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default DetailView;