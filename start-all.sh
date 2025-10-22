#!/bin/bash

echo "🚀 Starting SwiftBank Full-Stack Banking System..."
echo ""

# Set Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Start Backend
echo "📦 Starting Backend (Spring Boot)..."
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=test > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Start Frontend
echo "🎨 Starting Frontend (React + Vite)..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo "✅ SwiftBank is starting!"
echo ""
echo "📍 Access Points:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8080/api/v1"
echo "   API Docs: http://localhost:8080/swagger-ui.html"
echo ""
echo "🔑 Demo Credentials:"
echo "   Email:    demo@swiftbank.com"
echo "   Password: Demo123!"
echo "   2FA Code: 123456"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop both servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
