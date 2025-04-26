const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5001;

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  const filePath = path.join(__dirname, 'preview', 'index.html');
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error reading file: ${err.message}`);
      res.writeHead(500);
      res.end(`Error loading the page: ${err.message}`);
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content, 'utf-8');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Preview server running at http://0.0.0.0:${PORT}/`);
});