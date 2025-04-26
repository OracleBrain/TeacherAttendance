const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();

// Proxy API requests to the backend server
app.use('/api', (req, res) => {
  res.redirect(`http://localhost:8000${req.url}`);
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html for any route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(5000, '0.0.0.0', () => {
  console.log('Client server running on http://0.0.0.0:5000');
});

// Also start Vite in dev mode in the background
const vite = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});