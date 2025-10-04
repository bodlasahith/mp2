import axios from "axios";
import {
  SpotifySearchResponse,
  SpotifyUserProfile,
  SpotifyTrack,
  SpotifyAlbum,
} from "../types/spotify";

// Spotify API configuration
const CLIENT_ID = "8868cfdce4f745b297429d8ad81322c7";
// Dynamic redirect URI that works with Spotify's HTTPS requirement
const getRedirectUri = (): string => {
  if (window.location.hostname === "localhost") {
    // For local development, use 127.0.0.1 with current port
    const port = window.location.port || "3000";
    return `https://127.0.0.1:${port}/callback`;
  }
  // For production (GitHub Pages)
  return window.location.origin + "/callback";
};
const REDIRECT_URI = getRedirectUri();
const SCOPES = "user-read-private user-read-email user-top-read";

class SpotifyService {
  private baseURL = "https://api.spotify.com/v1";
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("spotify_access_token");
    this.setupAxiosInterceptors();
  }

  private setupAxiosInterceptors() {
    axios.interceptors.request.use((config) => {
      if (this.token && config.url?.includes("api.spotify.com")) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "token",
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      show_dialog: "true",
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  handleCallback(): boolean {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");

      if (accessToken) {
        this.token = accessToken;
        localStorage.setItem("spotify_access_token", accessToken);

        if (expiresIn) {
          const expirationTime = Date.now() + parseInt(expiresIn) * 1000;
          localStorage.setItem("spotify_token_expiration", expirationTime.toString());
        }

        // Clear the hash from URL
        window.location.hash = "";
        return true;
      }
    }
    return false;
  }

  isAuthenticated(): boolean {
    if (!this.token) return false;

    const expiration = localStorage.getItem("spotify_token_expiration");
    if (expiration && Date.now() > parseInt(expiration)) {
      this.clearAuth();
      return false;
    }

    return true;
  }

  clearAuth(): void {
    this.token = null;
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_token_expiration");
  }

  // API methods
  async getCurrentUser(): Promise<SpotifyUserProfile> {
    const response = await axios.get(`${this.baseURL}/me`);
    return response.data;
  }

  async search(
    query: string,
    types: string[] = ["track", "album", "artist"],
    limit: number = 20
  ): Promise<SpotifySearchResponse> {
    const params = new URLSearchParams({
      q: query,
      type: types.join(","),
      limit: limit.toString(),
      market: "US",
    });

    const response = await axios.get(`${this.baseURL}/search?${params.toString()}`);
    return response.data;
  }

  async getTopTracks(
    timeRange: string = "medium_term",
    limit: number = 50
  ): Promise<SpotifyTrack[]> {
    const response = await axios.get(`${this.baseURL}/me/top/tracks`, {
      params: { time_range: timeRange, limit },
    });
    return response.data.items;
  }

  async getTopArtists(timeRange: string = "medium_term", limit: number = 50) {
    const response = await axios.get(`${this.baseURL}/me/top/artists`, {
      params: { time_range: timeRange, limit },
    });
    return response.data.items;
  }

  async getFeaturedPlaylists() {
    const response = await axios.get(`${this.baseURL}/browse/featured-playlists`, {
      params: { limit: 50, country: "US" },
    });
    return response.data.playlists.items;
  }

  async getNewReleases(): Promise<SpotifyAlbum[]> {
    const response = await axios.get(`${this.baseURL}/browse/new-releases`, {
      params: { limit: 50, country: "US" },
    });
    return response.data.albums.items;
  }

  async getRecommendations(seedGenres: string[] = ["pop", "rock", "hip-hop"]) {
    const response = await axios.get(`${this.baseURL}/recommendations`, {
      params: {
        seed_genres: seedGenres.join(","),
        limit: 50,
        market: "US",
      },
    });
    return response.data.tracks;
  }

  async getAvailableGenres(): Promise<string[]> {
    const response = await axios.get(`${this.baseURL}/recommendations/available-genre-seeds`);
    return response.data.genres;
  }
}

const spotifyService = new SpotifyService();
export default spotifyService;
