# fix-and-start.ps1

$ErrorActionPreference = "Stop"
$maxAttempts = 3

function Retry-Command {
    param (
        [ScriptBlock]$Command,
        [string]$WorkingDir
    )

    $attempt = 1
    while ($attempt -le $maxAttempts) {
        Write-Host "🚀 Attempt #${attempt}: $($Command.ToString())" -ForegroundColor Yellow
        try {
            Push-Location $WorkingDir
            & $Command
            Pop-Location
            return
        } catch {
            Write-Host "⚠️ Failed on attempt #${attempt}: $_" -ForegroundColor Red
            Pop-Location
            Start-Sleep -Seconds 2
            $attempt++
        }
    }

    Write-Host "❌ Max attempts reached. Something went wrong." -ForegroundColor Red
}

# 🧹 Clean node_modules
Write-Host "`n🧹 Cleaning node_modules..." -ForegroundColor Cyan
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ".\client\node_modules", ".\server\node_modules"

# 📦 Install dependencies
Write-Host "`n📦 Installing server dependencies..." -ForegroundColor Cyan
Retry-Command -Command { npm install } -WorkingDir ".\server"

Write-Host "`n📦 Installing client dependencies..." -ForegroundColor Cyan
Retry-Command -Command { npm install } -WorkingDir ".\client"

# 🚀 Start backend (in a separate terminal)
Write-Host "`n🟢 Starting backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'cd .\server; node server.js'

# 🚀 Start frontend
Write-Host "`n🟢 Starting frontend..." -ForegroundColor Green
cd .\client
npm start
