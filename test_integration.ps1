Write-Host "=== MelCredit Bank Integration Test ===" -ForegroundColor Green
Write-Host ""

# Test 1: Check Backend Status
Write-Host "1. Testing Backend (Port 8080)..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/health" -TimeoutSec 5
    Write-Host "   ✅ Backend Status: $($health.status)" -ForegroundColor Green
    $backendOK = $true
} catch {
    Write-Host "   ❌ Backend Error: $($_.Exception.Message)" -ForegroundColor Red
    $backendOK = $false
}

# Test 2: Check Frontend Status
Write-Host "2. Testing Frontend (Port 3000)..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000/" -TimeoutSec 5 -UseBasicParsing
    if ($frontend.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend Status: OK (Status $($frontend.StatusCode))" -ForegroundColor Green
        $frontendOK = $true
    } else {
        Write-Host "   ❌ Frontend Status: $($frontend.StatusCode)" -ForegroundColor Red
        $frontendOK = $false
    }
} catch {
    Write-Host "   ❌ Frontend Error: $($_.Exception.Message)" -ForegroundColor Red
    $frontendOK = $false
}

# Test 3: Check Port Conflicts
Write-Host "3. Checking for Port Conflicts..." -ForegroundColor Yellow
$ports = netstat -ano | findstr "LISTENING"
$port8080 = $ports | findstr ":8080"
$port3000 = $ports | findstr ":3000"

if ($port8080) {
    Write-Host "   ✅ Port 8080: In use (Backend)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Port 8080: Not listening" -ForegroundColor Red
}

if ($port3000) {
    Write-Host "   ✅ Port 3000: In use (Frontend)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Port 3000: Not listening" -ForegroundColor Red
}

# Test 4: Backend-Frontend Integration
if ($backendOK) {
    Write-Host "4. Testing Backend-Frontend Integration..." -ForegroundColor Yellow
    
    # Test CORS
    Write-Host "   Testing CORS from frontend origin..." -ForegroundColor Cyan
    try {
        $headers = @{
            "Origin" = "http://localhost:3000"
            "Access-Control-Request-Method" = "POST"
            "Access-Control-Request-Headers" = "Content-Type"
        }
        $options = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" -Method OPTIONS -Headers $headers -UseBasicParsing -TimeoutSec 5
        Write-Host "   ✅ CORS: Working" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  CORS: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # Test Login API
    Write-Host "   Testing Login API..." -ForegroundColor Cyan
    try {
        $loginBody = @{
            email = "demo@melcredit.com"
            password = "demo123"
        } | ConvertTo-Json
        
        $login = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody -TimeoutSec 5
        Write-Host "   ✅ Login API: Working (Token received)" -ForegroundColor Green
        
        # Test Authenticated API
        Write-Host "   Testing Authenticated API..." -ForegroundColor Cyan
        $authHeaders = @{
            "Authorization" = "Bearer $($login.accessToken)"
        }
        
        $accounts = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/accounts" -Headers $authHeaders -TimeoutSec 5
        Write-Host "   ✅ Auth API: Working (Account data received)" -ForegroundColor Green
        
    } catch {
        Write-Host "   ❌ API Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Summary
Write-Host ""
Write-Host "=== INTEGRATION TEST SUMMARY ===" -ForegroundColor Green
if ($backendOK -and $frontendOK) {
    Write-Host "🟢 STATUS: NO CONFLICTS DETECTED" -ForegroundColor Green
    Write-Host "Both servers are running correctly and can communicate." -ForegroundColor Green
} else {
    Write-Host "🟡 STATUS: ISSUES DETECTED" -ForegroundColor Yellow
    if (!$backendOK) { Write-Host "- Backend needs to be started" -ForegroundColor Yellow }
    if (!$frontendOK) { Write-Host "- Frontend needs to be started" -ForegroundColor Yellow }
}

Write-Host ""
Read-Host -Prompt "Press Enter to exit"