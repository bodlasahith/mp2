# Spotify API Setup Instructions

## Required: Configure Spotify Client ID

Before deploying or running this application, you **must** set up your Spotify Client ID:

### Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - App Name: "MP2 Music Explorer" (or any name you prefer)
   - App Description: "CS-409 MP2 Assignment"
   - Website: Your GitHub Pages URL (e.g., https://yourusername.github.io/mp2)
   - Redirect URIs:
     - `https://yourusername.github.io/mp2/callback`
     - `http://localhost:3000/callback` (for local development)

### Step 2: Get Your Client ID

1. After creating the app, you'll see your Client ID
2. Copy this Client ID

### Step 3: Update the Code

1. Open `src/services/spotifyService.ts`
2. Find line 5: `const CLIENT_ID = 'your_spotify_client_id';`
3. Replace `'your_spotify_client_id'` with your actual Client ID
4. Example: `const CLIENT_ID = 'abcd1234efgh5678ijkl9012mnop3456';`

### Step 4: Deploy

After updating the Client ID, commit and push your changes to GitHub. The GitHub Actions will automatically deploy your app.

## Important Notes

- Keep your Client ID in the code - it's meant to be public for client-side apps
- Never share your Client Secret (you don't need it for this app anyway)
- The redirect URI in your Spotify app settings must exactly match your deployed URL
- Users will need a Spotify account to use your app

## Testing Locally

1. Make sure you have both redirect URIs added to your Spotify app settings
2. Run `npm start`
3. The app will be available at `http://localhost:3000`
