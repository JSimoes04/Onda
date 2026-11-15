const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, join, normalize } = require('node:path');

const PORT = Number(process.env.PORT ?? 3000);

const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
};

async function serveFile(request, response) {
  const { pathname } = new URL(request.url, 'http://localhost');
  const path = pathname.endsWith('/') ? `${pathname}index.html` : pathname;

  try {
    const file = await readFile(join(__dirname, normalize(path)));
    response.writeHead(200, { 'Content-Type': CONTENT_TYPES[extname(path)] ?? 'text/plain' });
    response.end(file);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('404 not found');
  }
}

function main() {
  const server = createServer(serveFile);
  server.on('error', reportStartupError);
  server.listen(PORT, () => {
    console.log(`Vaga is running at http://localhost:${PORT}`);
  });
}

function reportStartupError(error) {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use: stop the other server, or choose another port with PORT`);
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
}

main();
