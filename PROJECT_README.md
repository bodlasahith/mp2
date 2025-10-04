# Spotify Music Explorer

A React TypeScript application that allows users to search, browse, and explore music data from the Spotify API. Built for CS-409 MP2.

## Features

- **🔍 List View**: Search tracks, albums, and artists with real-time filtering and multiple sorting options
- **🖼️ Gallery View**: Browse music in a visual gallery format with filtering by genre and year
- **📊 Detail View**: View comprehensive information about tracks, albums, and artists with navigation between items
- **🎵 Audio Previews**: Listen to track previews when available
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technologies Used

- React 19 with TypeScript
- React Router for routing
- Axios for API calls
- Spotify Web API
- CSS3 with responsive design

## Getting Started

### Prerequisites

1. Node.js (version 14 or higher)
2. A Spotify Developer account
3. npm or yarn

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd mp2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Spotify API**

   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Note your Client ID
   - Add your redirect URI to the app settings:
     - For local development: `http://localhost:3000/callback`
     - For production: `https://[your-username].github.io/mp2/callback`

4. **Update Spotify Client ID**

   - Open `src/services/spotifyService.ts`
   - Replace `'your_spotify_client_id'` on line 5 with your actual Spotify Client ID

5. **Run the application**

   ```bash
   npm start
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Click "Login with Spotify" to authenticate

## Deployment

This app is configured for GitHub Pages deployment:

1. The `package.json` includes the homepage field
2. The router is configured with the correct basename
3. GitHub Actions workflow is set up for automatic deployment

## API Usage

The application uses the Spotify Web API to:

- Authenticate users via OAuth 2.0
- Search for tracks, albums, and artists
- Get user's top tracks and artists
- Fetch new releases and featured content
- Get audio previews for tracks

## Features Implemented

### List View ✅

- Real-time search with debouncing
- Multiple sort options (name, popularity, release date, duration)
- Ascending/descending sort order
- Filter as you type

### Gallery View ✅

- Visual grid layout of album covers/artist images
- Filtering by genre (for artists)
- Filtering by release year (for albums/tracks)
- Smooth hover animations

### Detail View ✅

- Comprehensive item information
- Previous/Next navigation through search results
- Audio preview for tracks (when available)
- Direct links to Spotify

### Additional Features ✅

- TypeScript for type safety
- Responsive design for all screen sizes
- Loading states and error handling
- Smooth animations and transitions
- Spotify authentication flow

## Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.tsx     # Landing/login page
│   ├── ListView.tsx     # Search and list view
│   ├── GalleryView.tsx  # Visual gallery
│   ├── DetailView.tsx   # Detailed item view
│   ├── Navbar.tsx       # Navigation bar
│   ├── CallbackPage.tsx # OAuth callback handler
│   └── *.css           # Component styles
├── services/           # API services
│   └── spotifyService.ts # Spotify API integration
├── types/              # TypeScript type definitions
│   └── spotify.ts      # Spotify API types
├── App.tsx             # Main app component with routing
└── index.tsx           # App entry point
```

## Notes

- The Spotify API requires authentication, so users need a Spotify account
- Some API endpoints may have rate limiting
- Not all tracks have audio previews available
- The app handles authentication token expiration automatically

## Demo

[Live Demo](https://bodlasahith.github.io/mp2)

---

Built with ❤️ for CS-409 at UIUC
