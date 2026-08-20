# PreLegal Backend ⚡

FastAPI backend for PreLegal, managed with `uv`.

## Features
- FastAPI web service
- SQLite database initialized fresh on container start with `users` table
- Health check endpoints (`/api/health`)
- User management and authentication endpoints (`/api/users`, `/api/auth/login`)
- Static file server for Next.js frontend build
