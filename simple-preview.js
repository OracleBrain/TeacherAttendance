const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the preview directory
app.use(express.static(path.join(__dirname, 'preview')));

// Serve index.html for the root route only
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'preview', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Preview server running at http://0.0.0.0:${PORT}`);
});