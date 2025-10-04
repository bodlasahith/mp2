import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import spotifyService from '../services/spotifyService';
import { SpotifyTrack, SpotifyAlbum, SpotifyArtist, SortOption, SortOrder } from '../types/spotify';
import './ListView.css';

type SearchItem = SpotifyTrack | SpotifyAlbum | SpotifyArtist;

const ListView: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState<'track' | 'album' | 'artist'>('track');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    if (!spotifyService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const searchMusic = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await spotifyService.search(query, [searchType], 50);
      let results: SearchItem[] = [];
      
      if (searchType === 'track' && response.tracks) {
        results = response.tracks.items;
      } else if (searchType === 'album' && response.albums) {
        results = response.albums.items;
      } else if (searchType === 'artist' && response.artists) {
        results = response.artists.items;
      }
      
      setSearchResults(results);
    } catch (err) {
      setError('Error searching music. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchType]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMusic(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchMusic]);

  const sortResults = (results: SearchItem[]): SearchItem[] => {
    return [...results].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'popularity':
          aValue = ('popularity' in a) ? a.popularity : 0;
          bValue = ('popularity' in b) ? b.popularity : 0;
          break;
        case 'release_date':
          if (searchType === 'album') {
            aValue = new Date((a as SpotifyAlbum).release_date);
            bValue = new Date((b as SpotifyAlbum).release_date);
          } else if (searchType === 'track') {
            aValue = new Date((a as SpotifyTrack).album.release_date);
            bValue = new Date((b as SpotifyTrack).album.release_date);
          } else {
            return 0;
          }
          break;
        case 'duration':
          if (searchType === 'track') {
            aValue = (a as SpotifyTrack).duration_ms;
            bValue = (b as SpotifyTrack).duration_ms;
          } else {
            return 0;
          }
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedResults = sortResults(searchResults);

  const getItemImage = (item: SearchItem): string => {
    if ('images' in item && item.images.length > 0) {
      return item.images[0].url;
    }
    if ('album' in item && item.album.images.length > 0) {
      return item.album.images[0].url;
    }
    return '';
  };

  const getItemSubtitle = (item: SearchItem): string => {
    if (searchType === 'track') {
      const track = item as SpotifyTrack;
      return track.artists.map(artist => artist.name).join(', ');
    } else if (searchType === 'album') {
      const album = item as SpotifyAlbum;
      return album.artists.map(artist => artist.name).join(', ');
    } else if (searchType === 'artist') {
      const artist = item as SpotifyArtist;
      return artist.genres.slice(0, 2).join(', ') || 'Artist';
    }
    return '';
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="list-view">
      <div className="search-controls">
        <h1>Search Music</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Search for ${searchType}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="search-type">Type:</label>
            <select 
              id="search-type"
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value as 'track' | 'album' | 'artist')}
            >
              <option value="track">Tracks</option>
              <option value="album">Albums</option>
              <option value="artist">Artists</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select id="sort-by" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
              <option value="name">Name</option>
              <option value="popularity">Popularity</option>
              {(searchType === 'album' || searchType === 'track') && (
                <option value="release_date">Release Date</option>
              )}
              {searchType === 'track' && (
                <option value="duration">Duration</option>
              )}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-order">Order:</label>
            <select id="sort-order" value={sortOrder} onChange={(e) => setSortOrder(e.target.value as SortOrder)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <div className="loading">Searching...</div>}
      {error && <div className="error">{error}</div>}

      <div className="results">
        {sortedResults.map((item) => (
          <Link
            key={item.id}
            to={`/detail/${searchType}/${item.id}`}
            className="result-item"
            state={{ item, allResults: sortedResults, currentIndex: sortedResults.indexOf(item) }}
          >
            <div className="item-image">
              {getItemImage(item) && (
                <img src={getItemImage(item)} alt={item.name} />
              )}
            </div>
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="subtitle">{getItemSubtitle(item)}</p>
              <div className="item-details">
                {'popularity' in item && (
                  <span className="popularity">Popularity: {item.popularity}%</span>
                )}
                {searchType === 'track' && 'duration_ms' in item && (
                  <span className="duration">{formatDuration(item.duration_ms)}</span>
                )}
                {searchType === 'album' && 'release_date' in item && (
                  <span className="release-date">{new Date(item.release_date).getFullYear()}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {sortedResults.length === 0 && searchQuery && !loading && (
        <div className="no-results">
          No {searchType}s found for "{searchQuery}"
        </div>
      )}
    </div>
  );
};

export default ListView;