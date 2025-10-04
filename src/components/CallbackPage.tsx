import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import spotifyService from '../services/spotifyService';
import './CallbackPage.css';

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const success = spotifyService.handleCallback();
        if (success) {
          navigate('/list');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error handling callback:', error);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="callback-container">
      <h2>Logging you in...</h2>
      <p>Please wait while we connect to your Spotify account.</p>
    </div>
  );
};

export default CallbackPage;