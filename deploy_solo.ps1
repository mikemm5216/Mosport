# Mosport Deployment Script (Windows PowerShell)
# Constitutional Compliance: 1.4 (Bundle & Ship), 1.5 (Shadow Log)
#
# --- ANTIGRAVITY_LOG ---
# Created: 2026-01-22T21:04+07:00
# Purpose: Automated deployment with smart dependency management
# Modified by: Antigravity Agent
# ---

param(
    [Parameter(Mandatory=$true, HelpMessage="Commit message for this deployment")]
    [string]$message
)

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 Mosport Deployment Script" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Step 1: Backend Dependencies
Write-Host "[1/5] 📦 Freezing backend dependencies..." -ForegroundColor Yellow

Push-Location backend

# Option A: Use pipreqs (smart detection - only used imports)
try {
    Write-Host "  → Using pipreqs for smart dependency detection..." -ForegroundColor Gray
    pipreqs . --force
    Write-Host "  ✓ Smart requirements.txt generated" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ pipreqs failed, falling back to pip freeze..." -ForegroundColor Yellow
    pip freeze | Select-String -Pattern "^(fastapi|uvicorn|sqlalchemy|asyncpg|redis|openai|slowapi|apscheduler|pydantic-settings)" > requirements.txt
    Write-Host "  ✓ Filtered requirements.txt generated" -ForegroundColor Green
}

Pop-Location

# Step 2: Frontend Build (Constitutional: Bundle & Ship)
Write-Host "`n[2/5] 🔨 Building frontend..." -ForegroundColor Yellow

# Check if package.json exists (assumes React app at root)
if (Test-Path "package.json") {
    Write-Host "  → Running npm build..." -ForegroundColor Gray
    
    # Install dependencies if node_modules missing
    if (-not (Test-Path "node_modules")) {
        Write-Host "  → Installing dependencies first..." -ForegroundColor Gray
        npm install
    }
    
    npm run build
    Write-Host "  ✓ Frontend bundle created in dist/" -ForegroundColor Green
} else {
    Write-Host "  ⚠ No package.json found, skipping frontend build" -ForegroundColor Yellow
    Write-Host "  → Assuming Vercel auto-build is configured" -ForegroundColor Gray
}

# Step 3: Git Operations
Write-Host "`n[3/5] 📝 Committing changes..." -ForegroundColor Yellow

git add .

# Check if there are changes to commit
$changes = git status --porcelain
if ($changes) {
    git commit -m "$message"
    Write-Host "  ✓ Changes committed: $message" -ForegroundColor Green
} else {
    Write-Host "  ⚠ No changes to commit" -ForegroundColor Yellow
}

# Step 4: Push to GitHub
Write-Host "`n[4/5] ☁️ Pushing to GitHub..." -ForegroundColor Yellow

try {
    git push origin main
    Write-Host "  ✓ Pushed to origin/main" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Push failed. Check your git remote configuration." -ForegroundColor Red
    exit 1
}

# Step 5: Deployment Status
Write-Host "`n[5/5] 🎯 Deployment initiated!" -ForegroundColor Green
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete`n" -ForegroundColor Green

Write-Host "📊 Deployment Status:" -ForegroundColor White
Write-Host "  • Backend → Railway (Auto-deploy triggered)" -ForegroundColor Gray
Write-Host "  • Frontend → Vercel (Auto-deploy triggered)" -ForegroundColor Gray
Write-Host "  • Scheduler → Will start with backend (ENABLE_SCHEDULER=True)" -ForegroundColor Gray

Write-Host "`n🔗 Next Steps:" -ForegroundColor White
Write-Host "  1. Check Railway logs: railway logs -f" -ForegroundColor Gray
Write-Host "  2. Verify scheduler: Look for '🚀 Mosport Backend Starting...'" -ForegroundColor Gray
Write-Host "  3. Test endpoint: curl https://your-app.railway.app/health" -ForegroundColor Gray

Write-Host "`n☕ Go grab a coffee while the build completes!`n" -ForegroundColor Cyan
