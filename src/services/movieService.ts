import axios from 'axios';
import { MovieDetails, Genre, TMDBResponse, GenreResponse } from '../types/movie';

const API_KEY = '08aa169d0d86a2b6a98557483972b074';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class MovieService {
  private api = axios.create({
    baseURL: BASE_URL,
    params: {
      api_key: API_KEY,
    },
  });

  // Search for movies
  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
    const response = await this.api.get<TMDBResponse>('/search/movie', {
      params: { query, page }
    });
    return response.data;
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<TMDBResponse> {
    const response = await this.api.get<TMDBResponse>('/movie/popular', {
      params: { page }
    });
    return response.data;
  }

  // Get movie details
  async getMovieDetails(id: number): Promise<MovieDetails> {
    const response = await this.api.get<MovieDetails>(`/movie/${id}`);
    return response.data;
  }

  // Get genres
  async getGenres(): Promise<Genre[]> {
    const response = await this.api.get<GenreResponse>('/genre/movie/list');
    return response.data.genres;
  }

  // Get movies by genre
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse> {
    const response = await this.api.get<TMDBResponse>('/discover/movie', {
      params: { with_genres: genreId, page }
    });
    return response.data;
  }

  // Get now playing movies
  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse> {
    const response = await this.api.get<TMDBResponse>('/movie/now_playing', {
      params: { page }
    });
    return response.data;
  }

  // Get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse> {
    const response = await this.api.get<TMDBResponse>('/movie/top_rated', {
      params: { page }
    });
    return response.data;
  }

  // Helper methods for images
  getPosterUrl(posterPath: string | null, size: string = 'w500'): string {
    return posterPath ? `${IMAGE_BASE_URL}/${size}${posterPath}` : '/placeholder-poster.jpg';
  }

  getBackdropUrl(backdropPath: string | null, size: string = 'w1280'): string {
    return backdropPath ? `${IMAGE_BASE_URL}/${size}${backdropPath}` : '/placeholder-backdrop.jpg';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  }

  formatRuntime(minutes: number): string {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatMoney(amount: number): string {
    if (!amount) return 'Unknown';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}

const movieService = new MovieService();
export default movieService;