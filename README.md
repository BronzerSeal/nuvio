# Nuvio

Nuvio is a company workspace app for boards, tasks, scheduling, timelines, availability planning, members, and role-based access.

Production: https://nuvio-coral.vercel.app/

## Features

- Company workspaces with members and roles: `owner`, `admin`, `member`
- Boards with kanban-style tasks
- Schedule page with two main tabs:
  - `Availability`: weekly availability calendar with draggable/resizable time spans
  - `Timeline`: role rows with draggable timeline tasks
- Real-time sync via Socket.IO rooms
- Authentication with Better Auth and Google OAuth
- PostgreSQL database through Prisma
- API validation with Zod
- API documentation through OpenAPI/Swagger
- Next.js App Router frontend with React Query and Tailwind CSS

## Tech Stack

Client:

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios
- Socket.IO client
- dnd-kit
- Better Auth client helpers

Server:

- Node.js
- Express 5
- TypeScript
- Prisma
- PostgreSQL
- Better Auth
- Socket.IO
- Zod validation
- Swagger UI / OpenAPI

## Project Structure

```txt
.
|-- client/                 # Next.js frontend
|   `-- src/
|       |-- app/            # App Router pages and route groups
|       |-- views/          # Page-level screens
|       |-- widgets/        # Larger UI blocks used across pages
|       |-- feature/        # User-facing feature modules
|       |-- entity/         # Domain entities, queries, models and UI
|       `-- shared/         # Shared UI, API clients, providers, config and utils
|
|-- server/                 # Express backend
|   |-- prisma/             # Prisma schema
|   `-- src/
|       |-- controllers/    # HTTP controllers
|       |-- services/       # Business logic
|       |-- routes/         # Express routes
|       |-- validate/       # Zod schemas
|       |-- middleware/     # Auth, validation and error handling
|       |-- sockets/        # Socket.IO room handlers
|       |-- docs/           # OpenAPI registry/routes
|       |-- lib/            # Prisma, auth and OpenAPI setup
|       `-- generated/      # Generated Prisma client
`-- README.md
```

The frontend mostly follows a Feature-Sliced style:

- `views/*`: route screens, for example `schedule-page`
- `entity/*`: domain-specific data, queries, model helpers and UI
- `shared/*`: generic primitives and infrastructure
- `widgets/*`: composed reusable page blocks
- `feature/*`: standalone user actions or flows

## Main Client Routes

```txt
/                         # auth entry
/auth/error               # auth error page
/dashboard                # dashboards/company selection
/dashboard/[companyId]    # company dashboard
/dashboard/[companyId]/boards
/dashboard/[companyId]/tasks
/dashboard/[companyId]/schedule
/account/settings
```

The schedule page is currently split into:

- `client/src/views/schedule-page/ui/availability-tab.tsx`
- `client/src/views/schedule-page/ui/timeline-tab.tsx`

Availability entity files live in:

```txt
client/src/entity/availability/
|-- model/
|-- queries/
`-- ui/
```

Timeline entity files live in:

```txt
client/src/entity/timeline/
|-- model/
|-- queries/
`-- ui/
```

## Getting Started

Install dependencies separately:

```bash
cd server
npm install

cd ../client
npm install
```

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

Default local URLs:

- Client: http://localhost:3000
- Server: http://localhost:8000
- API docs: http://localhost:8000/docs
- OpenAPI JSON: http://localhost:8000/docs-json

## Environment Variables

Client `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_BASE_URL` is used by Next rewrites and Socket.IO. Axios requests use the local `/api` base URL and are proxied to the backend by `client/next.config.ts`.

Server `.env`:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>?sslmode=require
PORT=8000
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
WEBSITE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Database

Prisma schema:

```txt
server/prisma/schema.prisma
```

Generate Prisma client:

```bash
cd server
npx prisma generate
```

Push schema changes:

```bash
cd server
npx prisma db push
```

Important domain models:

- `User`
- `Company`
- `CompanyMember`
- `Board`
- `Task`
- `Timeline`
- `TimelineRow`
- `TimelineTask`
- `Availability`
- `TimeSpan`

## API Overview

All app API routes are mounted under `/api`.

Company:

- `POST /api/company/join-or-create`
- `GET /api/company/user-companies`
- `GET /api/company/:companyId/memberships`
- `POST /api/company/:companyId/memberships`
- `DELETE /api/company/:companyId/memberships`
- `GET /api/company/:companyId/tasks`
- `GET /api/company/:companyId/tasks-count`
- `GET /api/company/:companyId/timeline`
- `GET /api/company/:companyId/availability`

Board:

- `POST /api/board/new-board`
- `GET /api/board/company/:companyId`
- `GET /api/board/:boardId/tasks`
- `GET /api/board/:companyId/boards/:boardId`
- `DELETE /api/board/:boardId`

Task:

- `POST /api/task/new-task`
- `PATCH /api/task/:taskId`

Timeline:

- `GET /api/timeline/:timelineId/rows`
- `POST /api/timeline/:timelineId/rows`
- `DELETE /api/timeline/:timelineId/rows`
- `GET /api/timeline/:timelineId/tasks`
- `POST /api/timeline/:timelineId/rows/:rowId/tasks`
- `PATCH /api/timeline/:timelineId/tasks/:taskId`
- `DELETE /api/timeline/:timelineId/tasks`

Availability:

- `GET /api/availability/:availabilityId/timeSpans`
- `POST /api/availability/:availabilityId/timeSpans`
- `PATCH /api/availability/:availabilityId/timeSpans/:timeSpanId`
- `DELETE /api/availability/:availabilityId/timeSpans/:timeSpanId`

Better Auth:

- `/api/auth/*`

For the complete current contract, use Swagger:

```txt
http://localhost:8000/docs
```

## Real-Time Updates

Socket.IO is initialized in `server/src/server.ts` and registered through `server/src/sockets/index.ts`.

Current rooms:

- Timeline room: `timelineId`
- Availability room: `availabilityId`
- Board room: board-specific socket handlers

Timeline socket events:

- Client emits `join-timeline`
- Client emits `leave-timeline`
- Server emits `timeline-task-updated`
- Server emits `timeline-row-updated`

Availability socket events:

- Client emits `join-availability`
- Client emits `leave-availability`
- Server emits `availability-updated`

The schedule tabs join and leave rooms based on the active tab. React Query invalidates entity query keys after socket events, so the UI refetches fresh data from the API.

## Client Data Flow

- API endpoints are declared in `client/src/shared/config/server-endpoints.ts`
- Axios instance lives in `client/src/shared/api/http.ts`
- Socket singleton lives in `client/src/shared/api/websockets.ts`
- React Query client lives in `client/src/shared/lib/query-client.ts`
- Entity queries live in `client/src/entity/*/queries`

Typical entity shape:

```txt
entity/<name>/
|-- model/      # API calls, helpers, domain transforms
|-- queries/    # React Query hooks
|-- ui/         # Entity UI components
`-- index.ts    # Public exports
```

## Scripts

Client:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run typecheck
```

Server:

```bash
npm run dev
npm run build
npm run start
```

## Development Notes

- Keep page orchestration in `views`, not inside entity UI components.
- Keep server requests and React Query hooks inside the matching `entity/*`.
- Shared UI primitives should stay in `shared/ui`.
- WebSocket handlers should only join/leave rooms and broadcast events; data refresh should still happen through React Query invalidation.
- Keep route validation in `server/src/validate` and call it through `validate(...)` middleware.
- Add or update OpenAPI docs in `server/src/docs/routes` when changing API contracts.

## Auth and Access Control

Authentication is handled by Better Auth. Protected server routes use `authMiddleware`.

Company-sensitive operations should check membership and role through server helpers/middleware, not only through client-side UI guards.
