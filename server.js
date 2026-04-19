
/**
 * Music Recommendation System Backend Server
 * 
 * This server connects to the MySQL database and provides API endpoints for the frontend.
 * 
 * To run this server:
 * 1. Install required packages: npm install express mysql2 cors body-parser
 * 2. Make sure MySQL server is running with the MusicRecSys database created
 * 3. Run: node server.js
 * 
 * For demo purposes, you can use the mock data in the frontend if the server isn't running.
 */

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // Replace with your MySQL username
  password: '',     // Replace with your MySQL password
  database: 'MusicRecSys'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM User WHERE UID = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(results[0]);
  });
});

// Update user profile
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { Username, Email, Password } = req.body;
  
  const query = 'UPDATE User SET Username = ?, Email = ?, Password = ? WHERE UID = ?';
  
  db.query(query, [Username, Email, Password, userId], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ message: 'User updated successfully' });
  });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  const query = 'DELETE FROM User WHERE UID = ?';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ message: 'User deleted successfully' });
  });
});

// Get all playlists for a user
app.get('/api/users/:id/playlists', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT p.* 
    FROM Playlist p
    JOIN UserPlaylist up ON p.PID = up.PID
    WHERE up.UID = ?
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching playlists:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

// Get songs in a playlist
app.get('/api/playlists/:id/songs', (req, res) => {
  const playlistId = req.params.id;
  
  const query = `
    SELECT s.* 
    FROM Song s
    JOIN PlaylistSong ps ON s.SID = ps.SID
    WHERE ps.PID = ?
  `;
  
  db.query(query, [playlistId], (err, results) => {
    if (err) {
      console.error('Error fetching playlist songs:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

// Create a new playlist
app.post('/api/playlists', (req, res) => {
  const { Name, NoOfSongs, UserId } = req.body;
  
  // Get current date
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  
  // First create the playlist
  const playlistQuery = `
    INSERT INTO Playlist (Name, NoOfSongs, DayCreated, MonthCreated, YearCreated) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(playlistQuery, [Name, NoOfSongs, day, month, year], (err, results) => {
    if (err) {
      console.error('Error creating playlist:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const playlistId = results.insertId;
    
    // Then associate it with the user
    const userPlaylistQuery = `
      INSERT INTO UserPlaylist (UID, PID)
      VALUES (?, ?)
    `;
    
    db.query(userPlaylistQuery, [UserId, playlistId], (err) => {
      if (err) {
        console.error('Error associating playlist with user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({ 
        message: 'Playlist created successfully',
        playlistId
      });
    });
  });
});

// Get all genres
app.get('/api/genres', (req, res) => {
  const query = 'SELECT * FROM Genre';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching genres:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

// Update user genre preferences
app.post('/api/users/:id/genres', (req, res) => {
  const userId = req.params.id;
  const { genreId, preferenceLevel } = req.body;
  
  // Check if this user-genre combo already exists
  const checkQuery = 'SELECT * FROM UserGenre WHERE UID = ? AND GID = ?';
  
  db.query(checkQuery, [userId, genreId], (err, results) => {
    if (err) {
      console.error('Error checking user genre:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length > 0) {
      // Update existing preference
      const updateQuery = 'UPDATE UserGenre SET PreferenceLevel = ? WHERE UID = ? AND GID = ?';
      
      db.query(updateQuery, [preferenceLevel, userId, genreId], (err) => {
        if (err) {
          console.error('Error updating genre preference:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ message: 'Genre preference updated' });
      });
    } else {
      // Insert new preference
      const insertQuery = 'INSERT INTO UserGenre (UID, GID, PreferenceLevel) VALUES (?, ?, ?)';
      
      db.query(insertQuery, [userId, genreId, preferenceLevel], (err) => {
        if (err) {
          console.error('Error inserting genre preference:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ message: 'Genre preference added' });
      });
    }
  });
});

// Get user genre preferences
app.get('/api/users/:id/genres', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT g.GID, g.Name, ug.PreferenceLevel 
    FROM Genre g
    LEFT JOIN UserGenre ug ON g.GID = ug.GID AND ug.UID = ?
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user genres:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

// Get song recommendations for a user
app.get('/api/users/:id/recommendations', (req, res) => {
  const userId = req.params.id;
  
  // Find songs from genres the user likes (preference level 7+)
  // that they haven't interacted with yet
  const query = `
    SELECT DISTINCT s.* 
    FROM Song s
    JOIN SongGenre sg ON s.SID = sg.SID
    JOIN UserGenre ug ON sg.GID = ug.GID
    WHERE ug.UID = ? 
    AND ug.PreferenceLevel >= 7
    AND s.SID NOT IN (
      SELECT SID FROM UserSongInteraction WHERE UID = ?
    )
    AND s.SID NOT IN (
      SELECT SID FROM UserSongSuggest WHERE UID = ? AND Suggested = 1
    )
    ORDER BY s.TotalFreq DESC
    LIMIT 5
  `;
  
  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching recommendations:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Mark these songs as suggested
    if (results.length > 0) {
      const songIds = results.map(song => song.SID);
      
      // Build a bulk insert query
      const values = songIds.map(sid => `(${userId}, ${sid}, 1)`).join(',');
      const markQuery = `
        INSERT INTO UserSongSuggest (UID, SID, Suggested)
        VALUES ${values}
        ON DUPLICATE KEY UPDATE Suggested = 1
      `;
      
      db.query(markQuery, (err) => {
        if (err) {
          console.error('Error marking songs as suggested:', err);
          // Continue anyway
        }
      });
    }
    
    res.json(results);
  });
});

// Record user song interaction
app.post('/api/users/:userId/songs/:songId/interaction', (req, res) => {
  const userId = req.params.userId;
  const songId = req.params.songId;
  const { liked } = req.body;
  
  // Get current date and time
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const time = today.toTimeString().split(' ')[0];
  
  // Check if interaction exists
  const checkQuery = 'SELECT * FROM UserSongInteraction WHERE UID = ? AND SID = ?';
  
  db.query(checkQuery, [userId, songId], (err, results) => {
    if (err) {
      console.error('Error checking interaction:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length > 0) {
      // Update existing interaction
      const playCount = results[0].PlayCount + 1;
      
      const updateQuery = `
        UPDATE UserSongInteraction 
        SET PlayCount = ?, 
            DayLastHeard = ?, 
            MonthLastHeard = ?, 
            YearLastHeard = ?, 
            LastHeardTime = ?,
            Liked = ?
        WHERE UID = ? AND SID = ?
      `;
      
      db.query(updateQuery, [playCount, day, month, year, time, liked, userId, songId], (err) => {
        if (err) {
          console.error('Error updating interaction:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ message: 'Interaction updated' });
      });
    } else {
      // Insert new interaction
      const insertQuery = `
        INSERT INTO UserSongInteraction 
        (UID, SID, PlayCount, DayLastHeard, MonthLastHeard, YearLastHeard, LastHeardTime, Liked)
        VALUES (?, ?, 1, ?, ?, ?, ?, ?)
      `;
      
      db.query(insertQuery, [userId, songId, day, month, year, time, liked], (err) => {
        if (err) {
          console.error('Error inserting interaction:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.json({ message: 'Interaction recorded' });
      });
    }
  });
});

// Get count of playlists for a user
app.get('/api/users/:id/playlist-count', (req, res) => {
  const userId = req.params.id;
  
  const query = `
    SELECT COUNT(*) as count
    FROM UserPlaylist
    WHERE UID = ?
  `;
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error counting playlists:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({ count: results[0].count });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
