# PowerShell start script for Windows

Write-Host "[+] Starting PreLegal V1 on Windows..." -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Error: Docker is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

Write-Host "[*] Building Docker image 'prelegal:latest'..." -ForegroundColor Yellow
docker build -t prelegal:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Docker build failed. Please verify Docker Desktop is running and try again." -ForegroundColor Red
    exit 1
}

Write-Host "[*] Cleaning up old containers if running..." -ForegroundColor Yellow
docker stop prelegal-app 2>$null
docker rm prelegal-app 2>$null

Write-Host "[+] Launching PreLegal container on port 8000..." -ForegroundColor Green
docker run -d --name prelegal-app -p 8000:8000 prelegal:latest

if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Container launch failed." -ForegroundColor Red
    exit 1
}

Write-Host "[+] PreLegal V1 is running successfully!" -ForegroundColor Green
Write-Host "[+] Backend and Application available at: http://localhost:8000" -ForegroundColor Cyan
