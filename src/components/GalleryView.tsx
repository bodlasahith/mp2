import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import spotifyService from '../services/spotifyService';
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from '../types/spotify';
import './GalleryView.css';

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'albums' | 'artists' | 'tracks'>('albums');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  useEffect(() => {
    if (!spotifyService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [albumsData, topArtists, topTracks, genres] = await Promise.all([
          spotifyService.getNewReleases(),
          spotifyService.getTopArtists(),
          spotifyService.getTopTracks(),
          spotifyService.getAvailableGenres()
        ]);

        setAlbums(albumsData);
        setArtists(topArtists);
        setTracks(topTracks);
        setAvailableGenres(genres);
      } catch (err) {
        setError('Error loading gallery data. Please try again.');
        console.error('Gallery error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredItems = () => {
    let items: any[] = [];
    
    switch (activeTab) {
      case 'albums':
        items = albums;
        break;
      case 'artists':
        items = artists;
        break;
      case 'tracks':
        items = tracks;
        break;
    }

    // Apply genre filter
    if (genreFilter) {
      if (activeTab === 'artists') {
        items = items.filter((artist: SpotifyArtist) => 
          artist.genres.some(genre => 
            genre.toLowerCase().includes(genreFilter.toLowerCase())
          )
        );
      } else if (activeTab === 'albums') {
        items = items.filter((album: SpotifyAlbum) => 
          album.artists.some(artist => 
            // For albums, we can't filter by genre directly since the API doesn't include genres
            // So we'll keep all items if genre filter is applied
            true
          )
        );
      } else if (activeTab === 'tracks') {
        items = items.filter((track: SpotifyTrack) => 
          track.artists.some(artist => 
            // Similar issue with tracks
            true
          )
        );
      }
    }

    // Apply year filter
    if (yearFilter) {
      if (activeTab === 'albums') {
        items = items.filter((album: SpotifyAlbum) => 
          new Date(album.release_date).getFullYear().toString() === yearFilter
        );
      } else if (activeTab === 'tracks') {
        items = items.filter((track: SpotifyTrack) => 
          new Date(track.album.release_date).getFullYear().toString() === yearFilter
        );
      }
    }

    return items;
  };

  const getAvailableYears = () => {
    let years = new Set<string>();
    
    if (activeTab === 'albums') {
      albums.forEach(album => {
        years.add(new Date(album.release_date).getFullYear().toString());
      });
    } else if (activeTab === 'tracks') {
      tracks.forEach(track => {
        years.add(new Date(track.album.release_date).getFullYear().toString());
      });
    }
    
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  };

  const getItemImage = (item: any): string => {
    if (activeTab === 'tracks') {
      return item.album.images[0]?.url || '';
    }
    return item.images[0]?.url || '';
  };

  const getItemTitle = (item: any): string => {
    return item.name;
  };

  const getItemSubtitle = (item: any): string => {
    if (activeTab === 'albums' || activeTab === 'tracks') {
      return item.artists?.map((artist: any) => artist.name).join(', ') || '';
    }
    return item.genres?.slice(0, 2).join(', ') || 'Artist';
  };

  const filteredItems = getFilteredItems();

  if (loading) return <div className="loading">Loading gallery...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="gallery-view">
      <div className="gallery-header">
        <h1>Music Gallery</h1>
        
        <div className="gallery-tabs">
          <button 
            className={activeTab === 'albums' ? 'active' : ''}
            onClick={() => {
              setActiveTab('albums');
              setGenreFilter('');
              setYearFilter('');
            }}
          >
            New Albums
          </button>
          <button 
            className={activeTab === 'artists' ? 'active' : ''}
            onClick={() => {
              setActiveTab('artists');
              setGenreFilter('');
              setYearFilter('');
            }}
          >
            Top Artists
          </button>
          <button 
            className={activeTab === 'tracks' ? 'active' : ''}
            onClick={() => {
              setActiveTab('tracks');
              setGenreFilter('');
              setYearFilter('');
            }}
          >
            Top Tracks
          </button>
        </div>

        <div className="gallery-filters">
          {activeTab === 'artists' && (
            <div className="filter-group">
              <label htmlFor="genre-filter">Filter by Genre:</label>
              <select 
                id="genre-filter"
                value={genreFilter} 
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <option value="">All Genres</option>
                {availableGenres.slice(0, 20).map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
          )}

          {(activeTab === 'albums' || activeTab === 'tracks') && (
            <div className="filter-group">
              <label htmlFor="year-filter">Filter by Year:</label>
              <select 
                id="year-filter"
                value={yearFilter} 
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="gallery-grid">
        {filteredItems.map((item, index) => (
          <Link
            key={item.id}
            to={`/detail/${activeTab.slice(0, -1)}/${item.id}`}
            className="gallery-item"
            state={{ 
              item, 
              allResults: filteredItems, 
              currentIndex: index 
            }}
          >
            <div className="gallery-image">
              <img 
                src={getItemImage(item)} 
                alt={getItemTitle(item)}
                loading="lazy"
              />
              <div className="gallery-overlay">
                <h3>{getItemTitle(item)}</h3>
                <p>{getItemSubtitle(item)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-results">
          No items found with current filters
        </div>
      )}
    </div>
  );
};

export default GalleryView;