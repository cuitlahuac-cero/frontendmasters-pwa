const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url'); // Add URL module to handle query params

// Define the base folder for serving static files
const publicFolder = path.join(__dirname, 'public');

// Function to serve static files
function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
      console.log(`Response: 404 Not Found`);  // Log 404 status
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.write(data);
      console.log(`Response: 200 OK`);  // Log 200 status
    }
    res.end();
  });
}

// Create the server
http.createServer(function (req, res) {
  // Log the incoming request with query params
  console.log(`Incoming request: ${req.method} ${req.url}`);

  // Parse the URL to handle query parameters
  const parsedUrl = url.parse(req.url, true); // Parse the URL and query string
  const pathname = parsedUrl.pathname; // Get the pathname without query params
  const queryParams = parsedUrl.query; // Get query parameters as an object

  // Log query parameters (if any)
  if (Object.keys(queryParams).length > 0) {
    console.log(`Query parameters:`, queryParams);
  }

  // Set the default file to be served (index.html)
  let filePath = path.join(publicFolder, pathname === '/' ? 'index.html' : pathname);

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
    case '.webmanifest':  // Correct content type for webmanifest files
      contentType = 'application/manifest+json';
      break;
    default:
      contentType = 'text/html';
  }

  // Serve the file
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Log the 404 error and respond
      console.log(`Error: File not found for ${pathname}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
      console.log(`Response: 404 Not Found`);
      res.end();
    } else {
      // Log the 200 success and serve the file
      serveFile(filePath, contentType, res);
    }
  });

}).listen(3000);

console.log("Server started on port 3000");
