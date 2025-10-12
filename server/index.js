require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_API_URL = process.env.BASE_API_URL || '';

// Serve static files from the dist directory (webpack build output)
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', baseApiUrl: BASE_API_URL });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`BASE_API_URL: ${BASE_API_URL}`);
});
