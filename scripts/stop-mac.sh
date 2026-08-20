#!/usr/bin/env bash
set -e

echo "🛑 Stopping PreLegal V1 container on macOS..."
if docker ps -q -f name=prelegal-app | grep -q .; then
    docker stop prelegal-app
    docker rm prelegal-app
    echo "✅ Container 'prelegal-app' stopped and removed."
else
    echo "ℹ️ Container 'prelegal-app' is not currently running."
fi
