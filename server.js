const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Handle large Base64 image data

// PostgreSQL database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'records_db',
  password: '12345',
  port: 5432, // Default PostgreSQL port
});

// API Endpoint: Match Fingerprint
app.post('/api/match-fingerprint', async (req, res) => {
  const { fingerprint } = req.body;

  if (!fingerprint) {
    return res.status(400).json({ message: 'Fingerprint image is required.' });
  }

  try {
    // Retrieve all records from the database
    const query = `
      SELECT nid, full_name, gender, dob, pob, crime, police_station, status,
      encode(image_column, 'base64') AS image_column
      FROM records
    `;
    const result = await pool.query(query);
    const records = result.rows;

    // Simulate matching logic (replace with real comparison)
    let bestMatch = null;
    let highestSimilarity = 0;

    records.forEach(record => {
      // Dummy similarity calculation (use an actual algorithm like SSIM)
      const similarity = Math.random();
      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = record;
      }
    });

    // Respond with the best match or no match found
    if (bestMatch) {
      // Add the data URI prefix to the Base64-encoded image
      bestMatch.image_column = `data:image/jpg;base64,${bestMatch.image_column}`;
      return res.status(200).json({ record: bestMatch, similarity: highestSimilarity });
    } else {
      return res.status(404).json({ message: 'No match found.' });
    }
  } catch (error) {
    console.error('Error matching fingerprint:', error);
    res.status(500).json({ message: 'Error matching fingerprint.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

