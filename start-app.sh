#!/bin/bash

echo "🏦 Starting SwiftBank Application"
echo "=================================="
echo ""

# Kill existing processes
echo "🧹 Cleaning up existing processes..."
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
sleep 2

# Set Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Start Backend
echo "🚀 Starting Backend (Spring Boot)..."
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
cd ..

# Wait for backend
echo "⏳ Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/v1/auth/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    sleep 2
    echo "   Still waiting... ($i/30)"
done

# Start Frontend
echo "🚀 Starting Frontend (React + Vite)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
cd ..

sleep 3

echo ""
echo "=================================="
echo "✅ Application Started!"
echo "=================================="
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8080/api/v1"
echo ""
echo "🔑 Demo Login:"
echo "   Email:    demo@swiftbank.com"
echo "   Password: Demo123!"
echo "   2FA Code: 123456"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop: kill $BACKEND_PID $FRONTEND_PID"
echo ""
