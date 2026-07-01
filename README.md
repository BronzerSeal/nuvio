# Nuvio

Nuvio is a collaborative timeline/board management platform with companies, boards, timelines, tasks, and role-based access control.

# Deploy

here is the vercel URL: https://nuvio-coral.vercel.app/

## Features

- Company-based workspace system
- Boards inside companies
- Timeline with rows and draggable tasks
- Role-based access (owner / admin / member)
- Real-time updates via WebSockets
- Authentication via Better Auth + Google OAuth
- PostgreSQL database with Prisma ORM
- Modern UI built with Next.js + React + Tailwind

---

## Tech Stack

### Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zustand
- TanStack Query (React Query)
- Lucide Icons

### Backend

- Node.js + Express
- Prisma ORM
- PostgreSQL
- Socket.IO
- Better Auth

---

## Project Structure

```
/client   - Next.js frontend
/server   - Express backend
```

---

## Environment Variables

### Client (.env.local)

```
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
```

### Server (.env)

```
DATABASE_URL=postgresql://<user>:<password>@pooled.db.prisma.io:5432/postgres?sslmode=require
PORT=8000
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
WEBSITE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Database

Run Prisma:

```bash
npx prisma db push
```

---

## Auth

Authentication is handled via Better Auth with Google OAuth support.

Session can be extended using `customSession` plugin to include roles:

```ts
customSession(async ({ user, session }) => {
  return {
    roles: ["owner", "admin", "member"],
    user,
    session,
  };
});
```

---

## API Overview

### Boards

- `POST /board/new-board`
- `GET /board/company/:companyId`
- `GET /board/:companyId/boards/:boardId`
- `DELETE /board/:boardId`

### Timeline

- `GET /timeline/:timelineId/tasks`
- `GET /timeline/:timelineId/rows`
- `POST /timeline/:timelineId/rows`
- (planned) `DELETE /timeline/rows`

### Tasks

- `GET /timeline/:timelineId/tasks`
- (planned) `DELETE /timeline/tasks`

---

## Key Concepts

### Access Control

Each company has members with roles:

- owner
- admin
- member

All sensitive operations are protected via middleware.

### Timeline System

- Rows represent roles or lanes
- Tasks are draggable blocks inside timeline
- Tasks belong to rows
- Supports drag & drop scheduling

---

## Development

### Start server

```bash
cd server
npm run dev
```

### Start client

```bash
cd client
npm run dev
```

---

## Notes

- Prisma is configured with a pooled PostgreSQL connection
- Real-time updates are handled via Socket.IO
- All timeline changes emit events to sync clients
