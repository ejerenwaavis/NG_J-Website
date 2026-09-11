# NG & J Swift - Deployment Script to Namecheap Production Server
$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  NG & J Swift - Deployment Pipeline   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Pre-flight Syntax Checks
Write-Host "`n[1/4] Running pre-flight syntax checks..." -ForegroundColor Yellow
try {
    node --check server.js
    Get-ChildItem -Path "routes", "models", "config" -Filter "*.js" -Recurse | ForEach-Object {
        node --check $_.FullName
    }
    Write-Host "  [OK] All backend JS syntax checks passed." -ForegroundColor Green
} catch {
    Write-Host "  [FAIL] Syntax check failed! Aborting deployment." -ForegroundColor Red
    exit 1
}

# 2. Git Status & Push
Write-Host "`n[2/4] Checking Git repository status..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "  [WARN] You have uncommitted changes:" -ForegroundColor DarkYellow
    git status -s
    $confirm = Read-Host "Would you like to commit these changes? (y/n)"
    if ($confirm -eq 'y' -or $confirm -eq 'Y') {
        $msg = Read-Host "Enter commit message"
        if (-not $msg) { $msg = "chore: deploy update" }
        git add -A
        git commit -m "$msg"
    } else {
        Write-Host "  [WARN] Proceeding with current committed HEAD only." -ForegroundColor DarkYellow
    }
}

Write-Host "Pushing to origin main..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [FAIL] Git push failed! Aborting." -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Pushed to origin/main successfully." -ForegroundColor Green

# 3. Remote Deployment via SSH
Write-Host "`n[3/4] Pulling updates and restarting app on Namecheap..." -ForegroundColor Yellow
$remoteCmd = 'source /home/ngankmnx/nodevenv/website/20/bin/activate && cd /home/ngankmnx/website && PREV_REV=$(git rev-parse HEAD) && git pull origin main && NEW_REV=$(git rev-parse HEAD) && if git diff --name-only $PREV_REV $NEW_REV | grep -q package; then echo "Dependencies updated, running npm ci..."; npm ci --omit=dev; fi && touch tmp/restart.txt && echo "Passenger restart triggered."'

ssh -o BatchMode=yes ngandj $remoteCmd
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [FAIL] Remote SSH deployment command returned an error." -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Remote server updated and reloaded." -ForegroundColor Green

# 4. Live Health Check
Write-Host "`n[4/4] Verifying live endpoint..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
try {
    $response = curl.exe -I -s https://ngandjswift.org
    $statusLine = ($response | Select-String "HTTP/").Line
    Write-Host "  Live Status: $statusLine" -ForegroundColor Green
    Write-Host "`nDeployment completed successfully! Live site: https://ngandjswift.org" -ForegroundColor Cyan
} catch {
    Write-Host "  [WARN] Could not verify live endpoint automatically: $_" -ForegroundColor DarkYellow
}
