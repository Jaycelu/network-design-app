# GEMINI.md

## 项目概述

这是一个专为网络工程师设计的“一站式集成服务平台”。它是一个全栈应用，包含Web前端、后端服务以及一个跨平台的桌面客户端。

项目采用以下技术栈构建：

*   **前端:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, React Flow
*   **后端:** Node.js, Express, Socket.IO, Prisma
*   **数据库:** SQLite (基于 `prisma/schema.prisma` 配置)
*   **桌面端应用:** Electron
*   **流量包分析:** Python, pyshark

该应用的核心架构由一个 Next.js 前端和一个自定义的 Node.js 后端服务组成。后端服务负责处理业务逻辑、数据库交互以及通过 Socket.IO 实现的实时通信。整个应用被封装在 Electron 容器中，以创建跨平台的桌面体验。此外，应用还调用 Python 脚本来进行网络抓包和流量分析。

## 构建与运行

### 环境要求

*   Node.js (v18 或更高版本)
*   npm / pnpm / yarn
*   Python

### 安装步骤

1.  安装 Node.js 依赖：
    ```bash
    npm install
    ```
2.  初始化数据库：
    ```bash
    npx prisma db push
    ```

### 运行应用

*   **Web 应用 (开发模式):**
    ```bash
    npm run dev
    ```
    此命令会启动 Next.js 开发服务器，您可以通过 `http://localhost:3005` 访问。

*   **桌面应用 (开发模式):**
    ```bash
    npm run desktop:dev
    ```
    此命令会同时启动 Next.js 开发服务器和 Electron 桌面应用。

*   **生产环境构建:**
    ```bash
    npm run build
    ```
    此命令会为 Next.js 应用创建生产环境的构建包。

*   **打包桌面应用:**
    ```bash
    npm run desktop:build
    ```
    此命令会构建用于生产环境的 Electron 桌面应用安装包。

## 开发规范

*   **代码检查 (Linting):** 项目使用 ESLint 进行代码规范检查。您可以运行以下命令来检查代码：
    ```bash
    npm run lint
    ```
*   **数据库迁移:** 项目使用 Prisma 管理数据库结构。要创建一个新的迁移，请运行：
    ```bash
    npx prisma migrate dev
    ```
*   **代码风格:** 项目主要使用 Tailwind CSS 进行样式开发，推荐遵循其“功能优先”的 CSS 编写方式。