const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the base folder for serving static files
const publicFolder = path.join(__dirname, 'public');

// Function to serve static files
function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.write(data);
    }
    res.end();
  });
}

// Create the server
http.createServer(function (req, res) {
  // Set the default file to be served (index.html)
  let filePath = path.join(publicFolder, req.url === '/' ? 'index.html' : req.url);

  // Determine the content type based on the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html'; // Default content type

  switch (extname) {
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
    case '.manifest':  // Serve the manifest file with correct header
      contentType = 'application/manifest+json';
      break;
    default:
      contentType = 'text/html';
  }

  // Serve the file
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If the file is not found, return a 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
      res.end();
    } else {
      serveFile(filePath, contentType, res);
    }
  });

}).listen(3000);

console.log("Server started on port 3000");

