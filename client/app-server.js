const express = require('express');
const path = require('path');
const history = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply history API fallback middleware
// This is crucial for SPA routing - it handles all routes and forwards them to index.html
app.use(history({
  verbose: true,
  disableDotRule: true
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the React app and files from the dist directory
app.use(express.static(path.join(__dirname)));

// Proxy API requests to the backend server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
}));

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`React app server running on http://0.0.0.0:${PORT}`);
});