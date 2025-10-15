# GEMINI.md - 项目上下文

## 项目概述

这是一个专为网络工程师设计的"一站式集成服务平台"。它是一个全栈应用，包含Web前端、后端服务以及一个跨平台的桌面客户端。

项目采用以下技术栈构建：

*   **前端:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, React Flow
*   **后端:** Node.js, Express, Socket.IO, Prisma
*   **数据库:** SQLite (基于 `prisma/schema.prisma` 配置)
*   **桌面端应用:** Electron
*   **流量包分析:** Python, pyshark

项目功能：
- **AI 驱动的网络生成器：** 自动生成网络图表和配置。
- **设备管理中心：** 一个集中管理网络设备的地方。
- **AI 故障排查助手：** 一个由 AI 驱动的助手，帮助排查网络问题。
- **数据包捕获与分析：** 用于捕获和分析网络数据包的工具。
- **AI 智能聊天：** 一个用于与 AI 交互的集成聊天界面。
- **实时 WebSocket 通信：** 使用 Socket.IO 实现客户端与服务器之间的实时通信。

该应用的核心架构由一个 Next.js 前端和一个自定义的 Node.js 后端服务组成。后端服务负责处理业务逻辑、数据库交互以及通过 Socket.IO 实现的实时通信。整个应用被封装在 Electron 容器中，以创建跨平台的桌面体验。此外，应用还调用 Python 脚本来进行网络抓包和流量分析。

该应用使用自定义服务器 (`server.ts`) 将 Socket.IO 与 Next.js 集成。数据库方面，它使用 Prisma。

## 构建与运行

### 环境要求

*   Node.js (v18 或更高版本)
*   npm / pnpm / yarn
*   Python

### 开发环境

在开发模式下运行应用程序（支持热重载）：

```bash
npm install
npm run dev
```

在开发模式下运行桌面应用程序：

```bash
npm run desktop:dev
```

应用程序将通过 `http://localhost:3005` 访问。

### 生产环境

为生产环境构建应用程序：

```bash
npm run build
```

运行生产服务器：

```bash
npm start
```

为生产环境构建桌面应用程序：

```bash
npm run desktop:build
```

## 开发规范

- **代码检查 (Linting):** 项目使用 ESLint 进行代码规范检查。您可以运行以下命令来检查代码：
    ```bash
    npm run lint
    ```
- **数据库迁移:** 项目使用 Prisma 管理数据库结构。要创建一个新的迁移，请运行：
    ```bash
    npx prisma migrate dev
    ```
- **代码风格：** 项目使用 ESLint 来强制执行一致的代码风格。
- **类型检查：** 使用 TypeScript 进行静态类型检查。
- **UI 组件：** 项目使用 shadcn/ui 作为其 UI 组件库。
- **状态管理：** 项目使用 Zustand 进行状态管理。
- **数据获取：** 项目使用 React Query 进行数据获取。
- **数据库：** 项目使用 Prisma 作为其 ORM。
- **实时通信：** 项目使用 Socket.IO 进行实时通信。
- **桌面应用：** 项目使用 Electron 将应用打包为桌面程序。
