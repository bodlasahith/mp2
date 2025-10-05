import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>MovieExplorer</h1>
        <p className="subtitle">Discover, explore, and organize your favorite movies</p>
        
        <div className="features">
          <div className="feature">
            <h3>Smart Search</h3>
            <p>Search and sort through thousands of movies with advanced filtering</p>
          </div>
          <div className="feature">
            <h3>Visual Gallery</h3>
            <p>Browse stunning movie posters and filter by genres</p>
          </div>
          <div className="feature">
            <h3>Detailed Info</h3>
            <p>Get comprehensive details including ratings, cast, and production info</p>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/search" className="cta-button">
            Start Searching Movies
          </Link>
          <Link to="/gallery" className="cta-button secondary">
            Browse Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;