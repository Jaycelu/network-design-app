# 项目概览

这是一个基于 Next.js 15、TypeScript、Tailwind CSS 与 shadcn/ui 的现代化网络设计应用脚手架。它集成了 Prisma、Socket.IO、自定义服务器与丰富的 UI 组件，适合快速原型开发与生产部署。

## 主要特性
- **现代技术栈**: Next.js 15（App Router）、TypeScript 5、Tailwind CSS 4、shadcn/ui
- **实时通信**: 集成 Socket.IO，自定义服务器路径 `/api/socketio`
- **数据库支持**: Prisma ORM（可选），集中式 `db` 客户端
- **丰富的 UI 组件**: 已内置常用组件与交互（对话框、抽屉、表单、表格、图表、拖拽等）
- **网络设计器**: 首页集成 `NetworkDesigner` 画布与工具栏，适合拓扑/流程建模
- **数据包捕获**: 集成网络抓包功能，支持实时数据包捕获和分析
- **AI 集成**: 内置 AI 聊天和分析功能
- **示例页面**: 提供 WebSocket Echo Demo（路径：`/examples/websocket`）

## 技术栈
- **框架**: Next.js 15, React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4, tailwindcss-animate
- **UI**: shadcn/ui（Radix UI 生态）, lucide-react
- **状态与数据**: Zustand, TanStack Query, Axios
- **表单与校验**: React Hook Form, Zod
- **图表与可视化**: Recharts, react-resizable-panels, DnD Kit, React Flow
- **后端与数据库**: 自定义 `server.ts`（HTTP + Socket.IO），Prisma
- **网络抓包**: Python + Scapy，支持实时数据包捕获
- **AI 功能**: 集成 AI 模型，支持智能分析和对话

# 目录结构

```
src/
  app/                 # Next.js App Router 页面
    api/               # API 路由
      packet-capture/  # 抓包功能 API
      ai-analyze-packet/ # AI 数据包分析 API
      chat/            # AI 聊天 API
  components/          # 可复用组件
    ui/                # shadcn/ui 组件
    network-designer/  # 网络设计器相关组件
    stock/             # 股票相关组件
  hooks/               # 自定义 hooks
  lib/                 # 工具与配置（db、socket、auth 等）
examples/
  websocket/           # WebSocket 演示页面
prisma/                # Prisma 数据库模式
electron/              # Electron 桌面应用配置
ai-chat-module/        # AI 聊天模块
temp/                  # 临时文件存储（PCAP 文件等）
server.ts              # 自定义服务器（Next.js + Socket.IO）
capture.py             # Python 抓包脚本
```

# 构建与运行

## 开发模式
```bash
npm run dev
```
这将启动自定义服务器（Next.js + Socket.IO），默认监听 http://localhost:3000

## 生产构建与启动
```bash
npm run build
npm start
```
- 生产模式使用 `server.ts` 启动，默认监听 `0.0.0.0:3000`
- Socket.IO 路径：`/api/socketio`

## 桌面应用（Electron）
```bash
# 桌面开发（自动拉起本地服务器与 Electron 窗口）
npm run desktop:dev

# 桌面打包（Windows NSIS 安装包）
npm run desktop:build
```

# 核心功能模块

## 1. 网络设计器 (Network Designer)
位于 `src/components/network-designer/`，是应用的核心模块，包含以下组件：

- **NetworkDesigner.tsx**: 主容器组件，管理视图模式和路由
- **CanvasArea.tsx**: 使用 React Flow 实现的可视化画布，支持拖拽节点、连接线等
- **AIIntegratedGenerator.tsx**: AI 集成生成器，根据用户输入自动生成网络架构方案
- **TopToolbar.tsx**: 顶部工具栏，包含用户认证功能
- **PropertiesPanel.tsx**: 属性面板，用于显示和编辑选中元素的属性
- **MainDashboard.tsx**: 主仪表板，提供模块选择入口
- **DeviceManagement.tsx**: 设备管理模块，支持多厂商设备管理、拖拽排序、实时搜索等
- **ProjectManagement.tsx**: 项目管理模块
- **Sidebar.tsx**: 侧边栏导航
- **ThemeToggle.tsx**: 主题切换组件

## 2. WebSocket 通信
- 服务端 Socket 初始化：`src/lib/socket.ts`
- 客户端使用 `socket.io-client`，通过 `path: '/api/socketio'` 连接

## 3. 自定义服务器
`server.ts` 文件实现了 Next.js 应用与 Socket.IO 服务器的集成。

## 4. 数据包捕获功能 (Packet Capture)
位于 `src/app/api/packet-capture/`，提供完整的网络抓包解决方案：

- **start/route.ts**: 开始抓包 API，支持自动接口检测
- **stop/route.ts**: 停止抓包 API
- **interfaces/route.ts**: 获取网络接口列表 API
- **stats/route.ts**: 获取抓包统计信息 API
- **download/route.ts**: 下载 PCAP 文件 API
- **upload/route.ts**: 上传 PCAP 文件 API
- **Python 脚本**: `capture.py` 使用 Scapy 进行实际数据包捕获
- **实时写入**: 支持每 50 个包实时写入 PCAP 文件
- **信号处理**: 支持强制保存和优雅退出

## 5. AI 集成功能
- **AI 聊天**: `src/app/api/chat/route.ts` 和 `ai-chat-module/`
- **AI 数据包分析**: `src/app/api/ai-analyze-packet/route.ts`
- **AI 架构生成**: 集成在 NetworkDesigner 组件中

## 6. 用户认证系统
- 基于 JWT 的用户认证机制
- 支持用户名、邮箱、手机号登录
- 用户信息本地缓存，7天有效期
- 服务端 API 地址：`http://152.136.160.91:9528`

# 开发约定

- 使用 TypeScript 进行类型安全开发
- 使用 Tailwind CSS 进行样式开发
- 使用 shadcn/ui 组件库
- 使用 React Hook Form 和 Zod 进行表单处理和验证
- 使用 Zustand 进行状态管理
- 使用 Prisma ORM 进行数据库操作（可选）

# 可用脚本

```json
"dev":   "nodemon --exec \"npx tsx server.ts\" --watch server.ts --watch src --ext ts,tsx,js,jsx 2>&1 | tee dev.log",
"build": "next build",
"start": "NODE_ENV=production tsx server.ts 2>&1 | tee server.log",
"lint":  "next lint",
"db:push":     "prisma db push",
"db:generate": "prisma generate",
"db:migrate":  "prisma migrate dev",
"db:reset":    "prisma migrate reset",
"desktop:dev": "concurrently -k -n srv,app \"npm:dev\" \"wait-on http://127.0.0.1:3005 && set NODE_ENV=development && electron .\"",
"desktop:pack": "npm run build && electron-builder --dir",
"desktop:build": "npm run build && electron-builder",
"desktop:electron": "electron .",
"desktop:simple": "NODE_ENV=development electron ."
```