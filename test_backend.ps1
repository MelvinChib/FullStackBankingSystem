try {
    Write-Host "Testing MelCredit Bank Backend API..." -ForegroundColor Green
    
    # Test health endpoint
    Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
    $health = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/health"
    Write-Host "Health Status: $($health.status)" -ForegroundColor Green
    
    # Test login endpoint
    Write-Host "2. Testing login endpoint..." -ForegroundColor Yellow
    $loginBody = @{
        email = "demo@melcredit.com"
        password = "demo123"
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "Login successful! Token received." -ForegroundColor Green
    Write-Host "User: $($login.user.name) ($($login.user.email))" -ForegroundColor Cyan
    Write-Host "Roles: $($login.user.roles -join ', ')" -ForegroundColor Cyan
    
    # Test authenticated endpoint
    Write-Host "3. Testing authenticated endpoint..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $($login.accessToken)"
    }
    
    $accounts = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/accounts" -Headers $headers
    Write-Host "Account balance: ZMW $($accounts[0].balance)" -ForegroundColor Green
    
    Write-Host "All tests passed! Backend is working correctly." -ForegroundColor Green
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Read-Host -Prompt "Press Enter to exit"