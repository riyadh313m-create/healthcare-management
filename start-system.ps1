# Healthcare Management System Startup Script
Write-Host "🏥 Starting Healthcare Management System..." -ForegroundColor Green
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if backend is already running
if (Test-Port 5000) {
    Write-Host "⚠️  Backend already running on port 5000" -ForegroundColor Yellow
} else {
    Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'E:\nd\backend'; npm start"
    Start-Sleep -Seconds 3
}

# Check if frontend is already running
if (Test-Port 5175) {
    Write-Host "⚠️  Frontend already running on port 5175" -ForegroundColor Yellow
} else {
    Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'E:\nd'; npm run dev"
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "✅ System Starting Complete!" -ForegroundColor Green
Write-Host "📡 Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "🌐 Frontend: http://localhost:5175" -ForegroundColor White
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Yellow
Write-Host "Username: admin    | Password: admin123" -ForegroundColor White
Write-Host "Username: admina   | Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
Read-Host