#!/usr/bin/env bash
set -e

echo "🚀 Starting PreLegal V1 on Linux..."
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed or not in PATH."
    exit 1
fi

echo "📦 Building Docker image 'prelegal:latest'..."
docker build -t prelegal:latest .

echo "🧹 Cleaning up old containers if running..."
docker stop prelegal-app 2>/dev/null || true
docker rm prelegal-app 2>/dev/null || true

echo "▶️ Launching PreLegal container on port 8000..."
docker run -d --name prelegal-app -p 8000:8000 prelegal:latest

echo "✅ PreLegal V1 is running successfully!"
echo "🌐 Backend & Application available at: http://localhost:8000"
