import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import { Movie, SortField, SortOrder } from '../types/movie';
import './ListView.css';

const ListView: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>('popularity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    loadDefaultMovies();
  }, []);

  const loadDefaultMovies = async () => {
    setLoading(true);
    try {
      const response = await movieService.getPopularMovies();
      setMovies(response.results);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadDefaultMovies();
      return;
    }

    setLoading(true);
    try {
      const response = await movieService.searchMovies(query);
      setMovies(response.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
    setLoading(false);
  };

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'release_date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortField === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [movies, sortField, sortOrder]);

  return (
    <div className="list-view">
      <div className="list-header">
        <h1>Search Movies</h1>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <div className="sort-controls">
            <label htmlFor="sort-field">Sort by:</label>
            <select
              id="sort-field"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="sort-select"
            >
              <option value="popularity">Popularity</option>
              <option value="title">Title</option>
              <option value="release_date">Release Date</option>
              <option value="vote_average">Rating</option>
            </select>
            <label htmlFor="sort-order">Order:</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="sort-select"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movie-list">
          {sortedMovies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-item">
              <img
                src={movieService.getPosterUrl(movie.poster_path, 'w200')}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="release-date">{movieService.formatDate(movie.release_date)}</p>
                <p className="rating">⭐ {movie.vote_average.toFixed(1)}/10</p>
                <p className="overview">{movie.overview}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListView;