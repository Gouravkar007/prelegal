# ==============================================================================
# Stage 1: Build Next.js Frontend Static Files
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Build FastAPI Backend & Serve Product V1
# ==============================================================================
FROM python:3.11-slim AS runner

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt-lists/*

# Install uv package manager
RUN pip install --no-cache-dir uv

# Copy backend files
COPY backend/ /app/backend/

# Copy static frontend export from stage 1 into backend static directory
COPY --from=frontend-builder /app/frontend/out /app/backend/static_frontend

WORKDIR /app/backend

# Install python dependencies with uv
RUN uv pip install --system -e .

EXPOSE 8000

ENV DATABASE_PATH="/app/backend/prelegal.db"
ENV STATIC_DIR="/app/backend/static_frontend"

# Launch FastAPI on port 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
