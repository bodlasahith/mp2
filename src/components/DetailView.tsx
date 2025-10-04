import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { SpotifyTrack, SpotifyAlbum, SpotifyArtist } from '../types/spotify';
import './DetailView.css';

interface LocationState {
  item: SpotifyTrack | SpotifyAlbum | SpotifyArtist;
  allResults: (SpotifyTrack | SpotifyAlbum | SpotifyArtist)[];
  currentIndex: number;
}

const DetailView: React.FC = () => {
  const { type } = useParams<{ type: string; id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allResults, setAllResults] = useState<(SpotifyTrack | SpotifyAlbum | SpotifyArtist)[]>([]);
  const [currentItem, setCurrentItem] = useState<SpotifyTrack | SpotifyAlbum | SpotifyArtist | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state && state.item && state.allResults) {
      setCurrentItem(state.item);
      setAllResults(state.allResults);
      setCurrentIndex(state.currentIndex);
    } else {
      // If no state, redirect back
      navigate('/list');
    }
  }, [location, navigate]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newItem = allResults[newIndex];
      setCurrentIndex(newIndex);
      setCurrentItem(newItem);
      
      // Update URL without navigation
      window.history.replaceState(
        { item: newItem, allResults, currentIndex: newIndex },
        '',
        `/detail/${type}/${newItem.id}`
      );
    }
  };

  const handleNext = () => {
    if (currentIndex < allResults.length - 1) {
      const newIndex = currentIndex + 1;
      const newItem = allResults[newIndex];
      setCurrentIndex(newIndex);
      setCurrentItem(newItem);
      
      // Update URL without navigation
      window.history.replaceState(
        { item: newItem, allResults, currentIndex: newIndex },
        '',
        `/detail/${type}/${newItem.id}`
      );
    }
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };



  const renderTrackDetails = (track: SpotifyTrack) => (
    <div className="detail-content">
      <div className="detail-image">
        <img src={track.album.images[0]?.url} alt={track.name} />
      </div>
      
      <div className="detail-info">
        <h1>{track.name}</h1>
        <p className="subtitle">by {track.artists.map(artist => artist.name).join(', ')}</p>
        
        <div className="details-grid">
          <div className="detail-item">
            <strong>Album:</strong> {track.album.name}
          </div>
          <div className="detail-item">
            <strong>Duration:</strong> {formatDuration(track.duration_ms)}
          </div>
          <div className="detail-item">
            <strong>Popularity:</strong> {track.popularity}%
          </div>
          <div className="detail-item">
            <strong>Release Date:</strong> {new Date(track.album.release_date).toLocaleDateString()}
          </div>
          <div className="detail-item">
            <strong>Track Number:</strong> {track.album.total_tracks} total tracks
          </div>
          
          {track.preview_url && (
            <div className="detail-item audio-preview">
              <strong>Preview:</strong>
              <audio controls>
                <source src={track.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          <div className="detail-item">
            <a 
              href={track.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className="spotify-link"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlbumDetails = (album: SpotifyAlbum) => (
    <div className="detail-content">
      <div className="detail-image">
        <img src={album.images[0]?.url} alt={album.name} />
      </div>
      
      <div className="detail-info">
        <h1>{album.name}</h1>
        <p className="subtitle">by {album.artists.map(artist => artist.name).join(', ')}</p>
        
        <div className="details-grid">
          <div className="detail-item">
            <strong>Type:</strong> {album.album_type}
          </div>
          <div className="detail-item">
            <strong>Release Date:</strong> {new Date(album.release_date).toLocaleDateString()}
          </div>
          <div className="detail-item">
            <strong>Total Tracks:</strong> {album.total_tracks}
          </div>
          
          <div className="detail-item">
            <a 
              href={album.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className="spotify-link"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArtistDetails = (artist: SpotifyArtist) => (
    <div className="detail-content">
      <div className="detail-image">
        <img src={artist.images[0]?.url} alt={artist.name} />
      </div>
      
      <div className="detail-info">
        <h1>{artist.name}</h1>
        
        <div className="details-grid">
          <div className="detail-item">
            <strong>Popularity:</strong> {artist.popularity}%
          </div>
          <div className="detail-item">
            <strong>Followers:</strong> {artist.followers.total.toLocaleString()}
          </div>
          <div className="detail-item">
            <strong>Genres:</strong>
            <div className="genres">
              {artist.genres.map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
          </div>
          
          <div className="detail-item">
            <a 
              href={artist.external_urls.spotify} 
              target="_blank" 
              rel="noopener noreferrer"
              className="spotify-link"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  if (!currentItem) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="detail-view">
      <div className="detail-header">
        <Link to="/list" className="back-button">← Back to Search</Link>
        
        <div className="navigation-controls">
          <button 
            onClick={handlePrevious} 
            disabled={currentIndex === 0}
            className="nav-button"
            title="Previous item"
          >
            ← Previous
          </button>
          
          <span className="navigation-info">
            {currentIndex + 1} of {allResults.length}
          </span>
          
          <button 
            onClick={handleNext} 
            disabled={currentIndex === allResults.length - 1}
            className="nav-button"
            title="Next item"
          >
            Next →
          </button>
        </div>
      </div>

      {type === 'track' && renderTrackDetails(currentItem as SpotifyTrack)}
      {type === 'album' && renderAlbumDetails(currentItem as SpotifyAlbum)}
      {type === 'artist' && renderArtistDetails(currentItem as SpotifyArtist)}
    </div>
  );
};

export default DetailView;