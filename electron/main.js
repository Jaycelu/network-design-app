const { app, BrowserWindow, shell } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

let serverProcess;
let mainWindow;

const PORT = process.env.PORT ? Number(process.env.PORT) : 3777;
const isDev = process.env.NODE_ENV !== 'production';
const serverUrl = `http://127.0.0.1:${PORT}`;

function startServer() {
    if (isDev) {
        const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        serverProcess = spawn(npmCmd, ['run', 'dev'], {
            cwd: process.cwd(),
            env: { ...process.env, PORT: String(PORT) },
            shell: true,
        });
    } else {
        const nodeCmd = process.execPath;
        const appPath = app.getAppPath();
        const serverEntry = path.join(appPath, 'server.ts');
        serverProcess = spawn(nodeCmd, ['-r', 'tsx/register', serverEntry], {
            cwd: appPath,
            env: { ...process.env, NODE_ENV: 'production', PORT: String(PORT) },
            shell: false,
        });
    }

    serverProcess.stdout.on('data', (data) => process.stdout.write(data));
    serverProcess.stderr.on('data', (data) => process.stderr.write(data));
    serverProcess.on('close', (code) => console.log(`Server exited with code: ${code}`));
}

function waitForHealthcheck(maxWaitMs = 20000, intervalMs = 300) {
    const deadline = Date.now() + maxWaitMs;
    return new Promise((resolve, reject) => {
        const check = () => {
            const req = http.get(`${serverUrl}/api/health`, (res) => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
                    resolve(true);
                } else {
                    retry();
                }
                res.resume();
            });
            req.on('error', retry);
            function retry() {
                if (Date.now() > deadline) reject(new Error('Healthcheck timeout'));
                else setTimeout(check, intervalMs);
            }
        };
        check();
    });
}

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true,
        },
    });

    await mainWindow.loadURL(serverUrl);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (isDev) {
            mainWindow.webContents.openDevTools({ mode: 'detach' });
        }
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.whenReady().then(async () => {
        startServer();
        try {
            await waitForHealthcheck();
        } catch (e) {
            console.error('[electron] healthcheck failed, still attempting to load window', e);
        }
        await createWindow();
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });

    app.on('before-quit', () => {
        if (serverProcess) serverProcess.kill();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}