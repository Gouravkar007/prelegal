# PowerShell start script for Windows

Write-Host "🚀 Starting PreLegal V1 on Windows..." -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Docker is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building Docker image 'prelegal:latest'..." -ForegroundColor Yellow
docker build -t prelegal:latest .

Write-Host "🧹 Cleaning up old containers if running..." -ForegroundColor Yellow
docker stop prelegal-app 2>$null
docker rm prelegal-app 2>$null

Write-Host "▶️ Launching PreLegal container on port 8000..." -ForegroundColor Green
docker run -d --name prelegal-app -p 8000:8000 prelegal:latest

Write-Host "✅ PreLegal V1 is running successfully!" -ForegroundColor Green
Write-Host "🌐 Backend & Application available at: http://localhost:8000" -ForegroundColor Cyan
