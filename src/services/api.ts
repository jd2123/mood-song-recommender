
// API service for interacting with the backend

// Base URL for all API requests
const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for making API requests
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// User interfaces
export interface User {
  UID: number;
  Username: string;
  Email: string;
  Password: string;
  DayJoined: number;
  MonthJoined: number;
  YearJoined: number;
}

export interface Playlist {
  PID: number;
  Name: string;
  NoOfSongs: number;
  DayCreated: number;
  MonthCreated: number;
  YearCreated: number;
}

export interface Song {
  SID: number;
  Title: string;
  Artist: string;
  Album: string;
  DayReleased: number;
  MonthReleased: number;
  YearReleased: number;
  TotalFreq: number;
}

export interface Genre {
  GID: number;
  Name: string;
  PreferenceLevel?: number;
}

// User API
export async function getUser(userId: number): Promise<User> {
  return fetchApi(`/users/${userId}`);
}

export async function updateUser(userId: number, userData: Partial<User>): Promise<{ message: string }> {
  return fetchApi(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(userId: number): Promise<{ message: string }> {
  return fetchApi(`/users/${userId}`, {
    method: 'DELETE',
  });
}

// Playlist API
export async function getUserPlaylists(userId: number): Promise<Playlist[]> {
  return fetchApi(`/users/${userId}/playlists`);
}

export async function getPlaylistSongs(playlistId: number): Promise<Song[]> {
  return fetchApi(`/playlists/${playlistId}/songs`);
}

export async function createPlaylist(name: string, noOfSongs: number, userId: number): Promise<{ message: string, playlistId: number }> {
  return fetchApi(`/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      Name: name,
      NoOfSongs: noOfSongs,
      UserId: userId,
    }),
  });
}

export async function getUserPlaylistCount(userId: number): Promise<{ count: number }> {
  return fetchApi(`/users/${userId}/playlist-count`);
}

// Genre API
export async function getAllGenres(): Promise<Genre[]> {
  return fetchApi(`/genres`);
}

export async function getUserGenres(userId: number): Promise<Genre[]> {
  return fetchApi(`/users/${userId}/genres`);
}

export async function updateUserGenrePreference(userId: number, genreId: number, preferenceLevel: number): Promise<{ message: string }> {
  return fetchApi(`/users/${userId}/genres`, {
    method: 'POST',
    body: JSON.stringify({
      genreId,
      preferenceLevel,
    }),
  });
}

// Recommendation API
export async function getUserRecommendations(userId: number): Promise<Song[]> {
  return fetchApi(`/users/${userId}/recommendations`);
}

// Song interaction API
export async function recordSongInteraction(userId: number, songId: number, liked: boolean): Promise<{ message: string }> {
  return fetchApi(`/users/${userId}/songs/${songId}/interaction`, {
    method: 'POST',
    body: JSON.stringify({ liked }),
  });
}

// Mock functions for testing without backend
export const mockApi = {
  getUser: (userId: number): Promise<User> => {
    return Promise.resolve({
      UID: 1,
      Username: 'Jaydev',
      Email: 'jaydev@example.com',
      Password: 'password123',
      DayJoined: 1,
      MonthJoined: 1,
      YearJoined: 2023
    });
  },
  
  getUserPlaylists: (userId: number): Promise<Playlist[]> => {
    return Promise.resolve([
      {
        PID: 101,
        Name: 'Workout Mix',
        NoOfSongs: 10,
        DayCreated: 15,
        MonthCreated: 1,
        YearCreated: 2025
      },
      {
        PID: 102,
        Name: 'Chill Vibes',
        NoOfSongs: 8,
        DayCreated: 20,
        MonthCreated: 1,
        YearCreated: 2025
      }
    ]);
  },
  
  getPlaylistSongs: (playlistId: number): Promise<Song[]> => {
    return Promise.resolve([
      {
        SID: 201,
        Title: 'Lose Yourself',
        Artist: 'Eminem',
        Album: '8 Mile',
        DayReleased: 22,
        MonthReleased: 10,
        YearReleased: 2002,
        TotalFreq: 5000000
      },
      {
        SID: 202,
        Title: 'Shape of You',
        Artist: 'Ed Sheeran',
        Album: 'Divide',
        DayReleased: 6,
        MonthReleased: 1,
        YearReleased: 2017,
        TotalFreq: 8000000
      }
    ]);
  },
  
  getUserGenres: (userId: number): Promise<Genre[]> => {
    return Promise.resolve([
      { GID: 301, Name: 'Hip-Hop', PreferenceLevel: 5 },
      { GID: 302, Name: 'Pop', PreferenceLevel: 4 },
      { GID: 303, Name: 'Rock', PreferenceLevel: 3 },
      { GID: 304, Name: 'Jazz', PreferenceLevel: 5 },
      { GID: 305, Name: 'Classical', PreferenceLevel: 2 },
      { GID: 306, Name: 'R&B', PreferenceLevel: 4 },
      { GID: 307, Name: 'Electronic', PreferenceLevel: 3 }
    ]);
  },
  
  getUserRecommendations: (userId: number): Promise<Song[]> => {
    return Promise.resolve([
      {
        SID: 203,
        Title: 'Bohemian Rhapsody',
        Artist: 'Queen',
        Album: 'A Night at the Opera',
        DayReleased: 31,
        MonthReleased: 10,
        YearReleased: 1975,
        TotalFreq: 9000000
      },
      {
        SID: 204,
        Title: 'Imagine',
        Artist: 'John Lennon',
        Album: 'Imagine',
        DayReleased: 9,
        MonthReleased: 9,
        YearReleased: 1971,
        TotalFreq: 7000000
      }
    ]);
  },
  
  getUserPlaylistCount: (userId: number): Promise<{ count: number }> => {
    return Promise.resolve({ count: 2 });
  }
};
