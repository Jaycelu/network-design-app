# Network Design App

一个基于 Next.js 15、TypeScript、Tailwind CSS 与 shadcn/ui 的现代化网络设计应用脚手架，内置 Prisma、Socket.IO、自定义服务器与丰富的 UI 组件，开箱即用，适合快速原型与生产部署。

## 主要特性
- **现代技术栈**: Next.js 15（App Router）、TypeScript 5、Tailwind CSS 4、shadcn/ui
- **实时通信**: 集成 Socket.IO，自定义服务器路径 `/api/socketio`
- **数据库准备好**: Prisma ORM（可选），集中式 `db` 客户端
- **完善的 UI 组件**: 已内置常用组件与交互（对话框、抽屉、表单、表格、图表、拖拽等）
- **网络设计器**: 首页集成 `NetworkDesigner` 画布与工具栏，适合拓扑/流程建模
- **示例页面**: 提供 WebSocket Echo Demo（路径：`/examples/websocket`）

## 技术栈
- **框架**: Next.js 15, React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4, tailwindcss-animate
- **UI**: shadcn/ui（Radix UI 生态）, lucide-react
- **状态与数据**: Zustand, TanStack Query, Axios
- **表单与校验**: React Hook Form, Zod
- **图表与可视化**: Recharts, react-resizable-panels, DnD Kit
- **后端与数据库**: 自定义 `server.ts`（HTTP + Socket.IO），Prisma

## 目录结构（节选）
```
src/
  app/                 # Next.js App Router 页面
  components/          # 可复用组件
    ui/                # shadcn/ui 组件
    network-designer/  # 网络设计器相关组件
  hooks/               # 自定义 hooks
  lib/                 # 工具与配置（db、socket 等）
examples/
  websocket/           # WebSocket 演示页面
server.ts              # 自定义服务器（Next.js + Socket.IO）
```

## 快速开始
1) 安装依赖
```bash
npm install
```

2) 开发模式
```bash
npm run dev
# 启动自定义服务器（Next + Socket.IO），默认监听 http://localhost:3000
```

3) 生产构建与启动
```bash
npm run build
npm start
```
- 生产模式使用 `server.ts` 启动，默认监听 `0.0.0.0:3000`
- Socket.IO 路径：`/api/socketio`
- Windows 注意：`package.json` 中的 `start` 使用类 UNIX 环境变量设置方式，若本机直接执行报错，可在 PowerShell 手动执行：
```powershell
$env:NODE_ENV = 'production'; tsx server.ts
```
或在 cmd 中：
```cmd
set NODE_ENV=production&& tsx server.ts
```

## 与数据库（可选）
项目内置 Prisma 客户端（`src/lib/db.ts`）。如需启用数据库：
- 设置环境变量 `DATABASE_URL`（例如 `.env` 文件）
- 推送/生成数据库结构：
```bash
npm run db:generate   # prisma generate
npm run db:push       # prisma db push
# 或开发迁移：npm run db:migrate
```

## WebSocket 示例
- 访问路径：`/examples/websocket`
- 服务端 Socket 初始化：`src/lib/socket.ts`
- 客户端使用 `socket.io-client`，通过 `path: '/api/socketio'` 连接

## 可用脚本
```json
"dev":   "nodemon --exec \"npx tsx server.ts\" --watch server.ts --watch src --ext ts,tsx,js,jsx 2>&1 | tee dev.log",
"build": "next build",
"start": "NODE_ENV=production tsx server.ts 2>&1 | tee server.log",
"lint":  "next lint",
"db:push":     "prisma db push",
"db:generate": "prisma generate",
"db:migrate":  "prisma migrate dev",
"db:reset":    "prisma migrate reset",
"desktop:dev": "concurrently -k -n srv,app \"npm:dev\" \"wait-on http://localhost:3000 && electron .\"",
"desktop:pack": "npm run build && electron-builder --dir",
"desktop:build": "npm run build && electron-builder"
```

## 部署建议
- 使用 `npm run build` 构建后，`npm start` 以自定义服务器托管 Next.js 与 Socket.IO。
- 生产环境建议：
  - 设置 `NODE_ENV=production`
  - 配置 `DATABASE_URL`（若使用数据库）
  - 打开防火墙端口 3000 或自定义端口并做反向代理

## 桌面应用（Electron）
1) 安装桌面依赖（首次）
```bash
npm install
```

2) 桌面开发（自动拉起本地服务器与 Electron 窗口）
```bash
npm run desktop:dev
# 渲染进程 DevTools 将自动打开
```

3) 桌面打包（Windows NSIS 安装包）
```bash
npm run desktop:build
# 产物在 dist/ 下
```

4) 说明
- 开发：Electron 主进程会调用 `npm run dev` 启动 `server.ts`，并加载 `http://localhost:3000`
- 生产：Electron 主进程直接以 `node -r tsx/register server.ts` 方式启动（无需依赖 `npm start`）
- 确保 `.next/` 已由 `npm run build` 生成，以便生产运行

## 可视化调试
- **前端（渲染进程）**：开发模式自动打开 DevTools，可配合 React DevTools 使用
- **主进程（Electron）**：可用 VSCode Attach 到 Electron 进程或通过 `ELECTRON_ENABLE_LOGGING=true` 打印日志
- **Node 服务器（server.ts）**：将 `dev` 脚本改为 `node --inspect -r tsx/register server.ts` 即可 9229 端口断点调试
- **Socket.IO**：在浏览器控制台设置 `localStorage.debug='socket.io-client:*'` 后刷新查看详细握手/事件日志