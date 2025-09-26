// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from './src/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import { config } from 'dotenv';
import path from 'path';

// 在服务器启动时加载环境变量
config({ path: path.resolve(process.cwd(), '.env.local') });

// 调试环境变量加载
console.log('=== 服务器环境变量加载调试 ===');
console.log('工作目录:', process.cwd());
console.log('AIHUBMIX_API_KEY:', process.env.AIHUBMIX_API_KEY ? '已设置' : '未设置');
console.log('AI_MODEL:', process.env.AI_MODEL);

const dev = process.env.NODE_ENV !== 'production';
const currentPort = Number(process.env.PORT || 3005);
const hostname = '127.0.0.1';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: dev
        ? {
            origin: 'http://localhost:' + currentPort,
            methods: ['GET', 'POST']
          }
        : undefined
    });

    setupSocket(io);

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
