# GEMINI.md - Project Context

## Project Overview

This is a "one-stop integrated service platform" designed for network engineers. It is a full-stack application that includes a web front-end, a back-end service, and a cross-platform desktop client.

The project is built with the following technology stack:

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, React Flow
*   **Backend:** Node.js, Express, Socket.IO, Prisma
*   **Database:** SQLite (configured via `prisma/schema.prisma`)
*   **Desktop App:** Electron
*   **Packet Analysis:** Python, pyshark

### Features:
- **AI-Powered Network Generator:** Automatically generate network diagrams and configurations.
- **Device Management Center:** A centralized place to manage network devices.
- **AI Troubleshooting Assistant:** An AI-powered assistant to help troubleshoot network issues.
- **Packet Capture & Analysis:** A tool for capturing and analyzing network packets.
- **AI Intelligent Chat:** An integrated chat interface for interacting with the AI.
- **Real-time WebSocket Communication:** Uses Socket.IO for real-time communication between the client and server.

The core architecture of the application consists of a Next.js frontend and a custom Node.js backend service. The backend service is responsible for handling business logic, database interactions, and real-time communication via Socket.IO. The entire application is wrapped in an Electron container to create a cross-platform desktop experience. Additionally, the application calls Python scripts for network packet capture and analysis.

The application uses a custom server (`server.ts`) to integrate Socket.IO with Next.js. For the database, it uses Prisma.

## Build and Run

### Environment Requirements

*   Node.js (v18 or later)
*   npm / pnpm / yarn
*   Python

### Development

To run the application in development mode (with hot-reloading):

```bash
npm install
npm run dev
```

To run the desktop application in development mode:

```bash
npm run desktop:dev
```

The application will be accessible at `http://localhost:3005`.

### Production

To build the application for production:

```bash
npm run build
```

To run the production server:

```bash
npm start
```

To build the desktop application for production:

```bash
npm run desktop:build
```

## Development Guidelines

- **Linting:** The project uses ESLint for code linting. You can run the following command to check the code:
    ```bash
    npm run lint
    ```
- **Database Migrations:** The project uses Prisma to manage the database schema. To create a new migration, run:
    ```bash
    npx prisma migrate dev
    ```
- **Code Style:** The project uses ESLint to enforce a consistent code style.
- **Type Checking:** Uses TypeScript for static type checking.
- **UI Components:** The project uses shadcn/ui as its UI component library.
- **State Management:** The project uses Zustand for state management.
- **Data Fetching:** The project uses React Query for data fetching.
- **Database:** The project uses Prisma as its ORM.
- **Real-time Communication:** The project uses Socket.IO for real-time communication.
- **Desktop App:** The project uses Electron to package the application as a desktop app.