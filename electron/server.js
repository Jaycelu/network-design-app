// Production server for Electron app
const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '127.0.0.1';
const port = 3000;

// Create Next.js app
const app = next({ 
  dev,
  dir: __dirname,
  conf: { distDir: '../.next' }
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer((req, res) => {
    // Skip socket.io requests from Next.js handler
    if (req.url?.startsWith('/api/socketio')) {
      return;
    }
    handle(req, res);
  });

  // Start the server
  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('Server startup error:', err);
      process.exit(1);
    }
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});