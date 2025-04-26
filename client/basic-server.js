const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve HTML file for all routes
app.get('*', (req, res) => {
  console.log('Sending basic-app.html file');
  res.sendFile(path.join(__dirname, 'basic-app.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Basic server running on http://0.0.0.0:${PORT}`);
  console.log(`Serving files from ${path.join(__dirname)}`);
});