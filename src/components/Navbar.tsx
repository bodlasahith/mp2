import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import spotifyService from '../services/spotifyService';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = spotifyService.isAuthenticated();

  const handleLogout = () => {
    spotifyService.clearAuth();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎵 Spotify Music Explorer</Link>
      </div>
      {isAuthenticated && (
        <div className="navbar-nav">
          <Link 
            to="/list" 
            className={location.pathname === '/list' ? 'active' : ''}
          >
            Search
          </Link>
          <Link 
            to="/gallery" 
            className={location.pathname === '/gallery' ? 'active' : ''}
          >
            Gallery
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;