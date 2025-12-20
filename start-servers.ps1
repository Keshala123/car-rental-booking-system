# Quick Start Script
# Run this to start both servers for screenshot capture

Write-Host "🚀 Starting Car Rental Booking System..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exist
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

if (-not (Test-Path "server\node_modules")) {
    Write-Host "Installing server dependencies..." -ForegroundColor Yellow
    cd server
    npm install
    cd ..
}

if (-not (Test-Path "client\node_modules")) {
    Write-Host "Installing client dependencies..." -ForegroundColor Yellow
    cd client
    npm install
    cd ..
}

Write-Host "✅ Dependencies ready!" -ForegroundColor Green
Write-Host ""

# Start backend in new window
Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; Write-Host '🔥 Backend running on http://localhost:5000' -ForegroundColor Green; npm run dev"

# Wait for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend in new window
Write-Host "🎨 Starting frontend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; Write-Host '🎨 Frontend running on http://localhost:5173' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "✅ Both servers starting..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📸 Ready for screenshots!" -ForegroundColor Yellow
Write-Host "   Navigate to each page and capture full-size screenshots" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to open browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:5173"
