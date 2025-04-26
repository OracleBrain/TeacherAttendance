const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Proxy API requests to the backend server
app.use('/api', createProxyMiddleware({ 
  target: 'http://localhost:8000',
  changeOrigin: true,
}));

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running on http://0.0.0.0:${PORT}`);
});