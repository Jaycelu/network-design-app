# Network Design App

A modern network design app scaffold built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui. It ships with Prisma, Socket.IO, a custom server, and a rich component set—ready for rapid prototyping and production deployment.

## Highlights
- **Modern stack**: Next.js 15 (App Router), TypeScript 5, Tailwind CSS 4, shadcn/ui
- **Real-time**: Socket.IO integration via custom server at `/api/socketio`
- **Database-ready**: Prisma ORM (optional) with centralized `db` client
- **Rich UI**: Common components and interactions (dialogs, drawers, forms, tables, charts, drag-and-drop)
- **Network Designer**: Home page mounts `NetworkDesigner` canvas and toolbars for topology/flow modeling
- **Example page**: WebSocket echo demo at `/examples/websocket`

## Tech stack
- **Framework**: Next.js 15, React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, tailwindcss-animate
- **UI**: shadcn/ui (Radix UI), lucide-react
- **State & data**: Zustand, TanStack Query, Axios
- **Forms & validation**: React Hook Form, Zod
- **Visualization**: Recharts, react-resizable-panels, DnD Kit
- **Backend & DB**: Custom `server.ts` (HTTP + Socket.IO), Prisma

## Project structure (excerpt)
```
src/
  app/                 # Next.js App Router pages
  components/          # Reusable components
    ui/                # shadcn/ui components
    network-designer/  # Network designer components
  hooks/               # Custom hooks
  lib/                 # Utilities & configs (db, socket, etc.)
examples/
  websocket/           # WebSocket demo page
server.ts              # Custom server (Next.js + Socket.IO)
```

## Getting started
1) Install dependencies
```bash
npm install
```

2) Development
```bash
npm run dev
# Launches custom server (Next + Socket.IO) at http://localhost:3000
```

3) Production build and start
```bash
npm run build
npm start
```
- Production runs via `server.ts` on `0.0.0.0:3000`
- Socket.IO path: `/api/socketio`
- Windows note: the `start` script sets env var in POSIX style. If it fails, run in PowerShell:
```powershell
$env:NODE_ENV = 'production'; tsx server.ts
```
or in cmd:
```cmd
set NODE_ENV=production&& tsx server.ts
```

## Database (optional)
Prisma client is available at `src/lib/db.ts`. To enable DB features:
- Configure `DATABASE_URL` (e.g., in `.env`)
- Push/generate schema:
```bash
npm run db:generate
npm run db:push
# or for development migrations: npm run db:migrate
```

## WebSocket demo
- Route: `/examples/websocket`
- Server initialization: `src/lib/socket.ts`
- Client uses `socket.io-client` with `path: '/api/socketio'`

## Available scripts
```json
"dev":   "nodemon --exec \"npx tsx server.ts\" --watch server.ts --watch src --ext ts,tsx,js,jsx 2>&1 | tee dev.log",
"build": "next build",
"start": "NODE_ENV=production tsx server.ts 2>&1 | tee server.log",
"lint":  "next lint",
"db:push":     "prisma db push",
"db:generate": "prisma generate",
"db:migrate":  "prisma migrate dev",
"db:reset":    "prisma migrate reset"
```

## Deployment notes
- Build with `npm run build`, then run `npm start` to serve both Next.js and Socket.IO via the custom server.
- Production checklist:
  - Set `NODE_ENV=production`
  - Configure `DATABASE_URL` if you use the database
  - Expose port 3000 or your custom port and configure reverse proxy as needed

## License
No specific license is included. Add a license file appropriate for your project. 