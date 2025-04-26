const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  
  // Default to index.html
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, serve index.html
      filePath = path.join(__dirname, 'index.html');
    }
    
    // Read the file
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading the page: ${err.message}`);
        return;
      }
      
      // Determine content type
      let contentType = 'text/html';
      const ext = path.extname(filePath);
      if (ext === '.js') contentType = 'text/javascript';
      if (ext === '.css') contentType = 'text/css';
      if (ext === '.json') contentType = 'application/json';
      if (ext === '.png') contentType = 'image/png';
      if (ext === '.jpg') contentType = 'image/jpg';
      
      // Serve the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running at http://0.0.0.0:${PORT}`);
  console.log(`Serving index.html from: ${path.join(__dirname, 'index.html')}`);
});