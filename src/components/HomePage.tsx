import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import spotifyService from '../services/spotifyService';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    if (spotifyService.isAuthenticated()) {
      navigate('/list');
    }
  }, [navigate]);

  const handleLogin = () => {
    window.location.href = spotifyService.getAuthUrl();
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>🎵 Spotify Music Explorer</h1>
        <p className="subtitle">Discover, explore, and organize your favorite music</p>
        
        <div className="features">
          <div className="feature">
            <h3>🔍 Smart Search</h3>
            <p>Search and sort through millions of tracks, albums, and artists</p>
          </div>
          <div className="feature">
            <h3>🖼️ Visual Gallery</h3>
            <p>Browse beautiful album covers and artist images</p>
          </div>
          <div className="feature">
            <h3>📊 Detailed Info</h3>
            <p>Get comprehensive details about your favorite music</p>
          </div>
        </div>

        <button onClick={handleLogin} className="login-button">
          Login with Spotify
        </button>
        
        <p className="note">
          Note: You'll need a Spotify account to use this application
        </p>
      </div>
    </div>
  );
};

export default HomePage;