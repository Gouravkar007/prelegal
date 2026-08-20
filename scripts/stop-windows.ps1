# PowerShell stop script for Windows

Write-Host "[*] Stopping PreLegal V1 container on Windows..." -ForegroundColor Yellow

$container = docker ps -q -f "name=prelegal-app"
if ($container) {
    docker stop prelegal-app
    docker rm prelegal-app
    Write-Host "[+] Container 'prelegal-app' stopped and removed." -ForegroundColor Green
} else {
    Write-Host "[i] Container 'prelegal-app' is not currently running." -ForegroundColor Cyan
}
