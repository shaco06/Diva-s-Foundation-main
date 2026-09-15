const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const rootDirectory = __dirname;
const port = Number(process.env.PORT || 3000);

const serveStaticFile = (request, response) => {
  const requestedPath = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const filePath = path.normalize(path.join(rootDirectory, requestedPath));

  if (!filePath.startsWith(rootDirectory)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500);
      response.end('Not found');
      return;
    }

    const contentTypes = {
      '.css': 'text/css; charset=utf-8',
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };
    response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
    response.end(file);
  });
};

const server = http.createServer((request, response) => {
  if (request.method === 'GET') {
    serveStaticFile(request, response);
    return;
  }

  response.writeHead(405);
  response.end('Método no permitido.');
});

server.listen(port, () => {
  console.log(`Fundación Diva's disponible en http://localhost:${port}`);
});