const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve the index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});