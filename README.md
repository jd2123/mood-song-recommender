
# Music Recommendation System

A web application for managing music playlists and getting personalized song recommendations based on genre preferences and listening history.

## Features

- **Dashboard** - Overview of user profile and music activity
- **Playlists** - Create and manage your playlists, view songs in each playlist
- **Genres** - Rate your music preferences to improve recommendations
- **Recommendations** - Get personalized song recommendations based on your preferences
- **Profile** - Manage your account information

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS for styling
- **Backend**: Node.js with Express
- **Database**: MySQL

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MySQL Server

### Database Setup

1. Create a database named `MusicRecSys` in MySQL
2. Import the provided SQL schema and sample data (included in the project)

### Server Setup

1. Open a terminal in the root directory
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the database connection in `server.js`:
   ```javascript
   const db = mysql.createConnection({
     host: 'localhost',     // Your MySQL host
     user: 'root',          // Your MySQL username
     password: '',          // Your MySQL password
     database: 'MusicRecSys'
   });
   ```
4. Start the server:
   ```
   node server.js
   ```
   The server will run on port 3001.

### Frontend Setup

1. Open a new terminal in the project directory
2. Start the frontend development server:
   ```
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:8080`

## Usage Guide

### For Demo Purposes

- The system is pre-configured to use the user with UID=1 (Jaydev)
- All functionalities are working with real database operations
- If the database connection fails, the app will fall back to mock data for demonstration purposes

### Key Features

1. **Playlists Section**:
   - View all your playlists
   - Click on a playlist to see its songs
   - Create a new playlist

2. **Genres Section**:
   - Rate your preferences for different music genres
   - Ratings are used to improve recommendations

3. **Recommendations Section**:
   - Get personalized music recommendations
   - Like or skip songs to improve future recommendations

4. **Profile Section**:
   - View and update your profile information
   - Delete your account if needed

## Project Structure

- `server.js` - Node.js/Express backend server
- `src/components/` - React UI components
- `src/services/api.ts` - API service for backend communication
- `src/pages/` - Main application pages
