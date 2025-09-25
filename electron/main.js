const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

let mainWindow;
let serverProcess;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: true, // 确保窗口可见
  });

  // 开发模式下加载本地服务器
  const isDev = process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() === 'development';
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('isDev:', isDev);
  
  if (isDev) {
    // 在开发模式下，直接连接到已经启动的服务器
    console.log('开发模式下启动应用');
    console.log('正在加载 URL: http://localhost:3005');
    mainWindow.loadURL('http://localhost:3005');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 在生产模式下，启动服务器并加载URL
    console.log('生产模式下启动应用');
    
    // 启动Next.js服务器
    const serverPath = path.join(__dirname, '../.next/standalone/server.js');
    serverProcess = spawn('node', [serverPath], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    // 等待服务器启动后加载URL
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:3005');
    }, 3000);
  }

  // 监听页面加载事件
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('开始加载页面...');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
    // 确保窗口在前台
    mainWindow.focus();
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('页面加载失败:', errorCode, errorDescription);
  });

  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null;
    // 关闭服务器进程
    if (serverProcess) {
      serverProcess.kill();
    }
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  console.log('Electron 应用已准备就绪');
  createWindow();

  app.on('activate', () => {
    // 在 macOS 上，当单击 dock 图标且没有其他窗口打开时，通常会在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口都关闭时退出应用，但在 macOS 上除外，因为在那里应用程序和它们的菜单栏会保持活动状态，直到用户明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 处理获取网络接口信息的请求
ipcMain.handle('get-network-interfaces', async () => {
  try {
    const interfaces = os.networkInterfaces();
    const result = [];
    
    for (const [name, networkInfos] of Object.entries(interfaces)) {
      if (networkInfos) {
        for (const networkInfo of networkInfos) {
          // 只处理 IPv4 地址并且不是内部地址
          if (networkInfo.family === 'IPv4' && !networkInfo.internal) {
            result.push({
              name,
              address: networkInfo.address,
              netmask: networkInfo.netmask,
              mac: networkInfo.mac,
              family: networkInfo.family,
              internal: networkInfo.internal,
            });
          }
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('获取网络接口信息失败:', error);
    return [];
  }
});