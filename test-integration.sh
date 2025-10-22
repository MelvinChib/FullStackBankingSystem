#!/bin/bash

# SwiftBank Integration Test Script
# Tests frontend-backend communication

echo "🏦 SwiftBank Integration Test"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:8080/api/v1"
FRONTEND_URL="http://localhost:5173"

echo "📋 Configuration:"
echo "  Backend:  $BACKEND_URL"
echo "  Frontend: $FRONTEND_URL"
echo ""

# Test 1: Backend Health Check
echo "1️⃣  Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/../actuator/health" 2>/dev/null)
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Backend is running"
else
    echo -e "   ${RED}✗${NC} Backend is not responding (HTTP $HEALTH_RESPONSE)"
    echo -e "   ${YELLOW}→${NC} Start backend: cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=test"
fi
echo ""

# Test 2: Frontend Check
echo "2️⃣  Testing Frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null)
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Frontend is running"
else
    echo -e "   ${RED}✗${NC} Frontend is not responding (HTTP $FRONTEND_RESPONSE)"
    echo -e "   ${YELLOW}→${NC} Start frontend: cd frontend && npm run dev"
fi
echo ""

# Test 3: CORS Configuration
echo "3️⃣  Testing CORS Configuration..."
CORS_RESPONSE=$(curl -s -X OPTIONS "$BACKEND_URL/accounts" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -o /dev/null -w "%{http_code}" 2>/dev/null)
if [ "$CORS_RESPONSE" = "200" ] || [ "$CORS_RESPONSE" = "204" ]; then
    echo -e "   ${GREEN}✓${NC} CORS is properly configured"
else
    echo -e "   ${RED}✗${NC} CORS may have issues (HTTP $CORS_RESPONSE)"
fi
echo ""

# Test 4: Auth Endpoint
echo "4️⃣  Testing Auth Endpoint..."
AUTH_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}' \
  -o /dev/null -w "%{http_code}" 2>/dev/null)
if [ "$AUTH_RESPONSE" = "401" ] || [ "$AUTH_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Auth endpoint is responding (HTTP $AUTH_RESPONSE)"
else
    echo -e "   ${YELLOW}⚠${NC}  Auth endpoint returned HTTP $AUTH_RESPONSE"
fi
echo ""

# Test 5: Demo Mode Check
echo "5️⃣  Checking Demo Mode Configuration..."
if [ -f "frontend/.env" ]; then
    DEMO_ENABLED=$(grep "VITE_ENABLE_DEMO" frontend/.env | cut -d '=' -f2)
    if [ "$DEMO_ENABLED" = "true" ]; then
        echo -e "   ${GREEN}✓${NC} Demo mode is enabled"
        DEMO_EMAIL=$(grep "VITE_DEMO_EMAIL" frontend/.env | cut -d '=' -f2)
        echo -e "   ${YELLOW}→${NC} Demo email: $DEMO_EMAIL"
    else
        echo -e "   ${YELLOW}⚠${NC}  Demo mode is disabled"
    fi
else
    echo -e "   ${RED}✗${NC} frontend/.env file not found"
fi
echo ""

# Summary
echo "=============================="
echo "📊 Test Summary"
echo "=============================="
echo ""
echo "Next Steps:"
echo "1. Ensure both backend and frontend are running"
echo "2. Open browser: $FRONTEND_URL/login"
echo "3. Use demo credentials to test login"
echo "4. Check browser console for API calls"
echo "5. Check backend logs for incoming requests"
echo ""
echo "For detailed integration info, see: INTEGRATION_GUIDE.md"
echo ""
