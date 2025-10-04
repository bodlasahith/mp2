export interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  genres: string[];
  popularity: number;
  followers: {
    total: number;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  artists: SpotifyArtist[];
  release_date: string;
  total_tracks: number;
  album_type: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  external_urls: SpotifyExternalUrls;
  preview_url: string | null;
}

export interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
    total: number;
  };
  albums?: {
    items: SpotifyAlbum[];
    total: number;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
  };
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
}

export type SortOption = 'name' | 'popularity' | 'release_date' | 'duration';
export type SortOrder = 'asc' | 'desc';