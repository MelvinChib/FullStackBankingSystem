#!/bin/bash

# MelvinBank Zambia - Application Startup Script
# This script starts both the backend and frontend applications

echo "🏦 Starting MelvinBank Zambia Application..."
echo "============================================"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend (Spring Boot)..."
    cd backend
    
    # Check if backend is already running
    if check_port 8080; then
        echo "⚠️  Backend is already running on port 8080"
        cd ..
        return 0
    fi
    
    # Start backend in background
    echo "📦 Building and starting backend..."
    mvn spring-boot:run -Dspring-boot.run.profiles=test > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    echo "⏳ Waiting for backend to start..."
    sleep 15
    
    # Check if backend started successfully
    if check_port 8080; then
        echo "✅ Backend started successfully on http://localhost:8080/api/v1"
        echo "📚 API Documentation: http://localhost:8080/api/v1/swagger-ui.html"
    else
        echo "❌ Backend failed to start. Check backend.log for errors."
        return 1
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend (React)..."
    cd frontend
    
    # Check if frontend is already running
    if check_port 5173; then
        echo "⚠️  Frontend is already running on port 5173"
        cd ..
        return 0
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        echo "⚙️  Creating .env file..."
        echo "VITE_API_URL=http://localhost:8080/api/v1" > .env
        echo "VITE_APP_NAME=MelvinBank Zambia" >> .env
        # Back-compat for CRA-style env reads
        echo "REACT_APP_API_URL=http://localhost:8080/api/v1" >> .env
    fi
    
    # Start frontend in background
    echo "🚀 Starting Vite development server..."
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    
    echo "⏳ Waiting for frontend to start..."
    sleep 10
    
    # Check if frontend started successfully
    if check_port 5173; then
        echo "✅ Frontend started successfully on http://localhost:5173"
    else
        echo "❌ Frontend failed to start. Check frontend.log for errors."
        return 1
    fi
    
    cd ..
}

# Function to show application status
show_status() {
    echo ""
    echo "🌐 Application Status:"
    echo "======================"
    
    if check_port 8080; then
        echo "✅ Backend API: http://localhost:8080/api/v1"
        echo "📚 API Docs: http://localhost:8080/api/v1/swagger-ui.html"
        echo "❤️  Health Check: http://localhost:8080/api/v1/actuator/health"
    else
        echo "❌ Backend: Not running"
    fi
    
    if check_port 5173; then
        echo "✅ Frontend: http://localhost:5173"
    else
        echo "❌ Frontend: Not running"
    fi
    
    echo ""
    echo "📋 Quick Start Commands:"
    echo "========================"
    echo "Register: curl -X POST http://localhost:8080/api/v1/auth/register \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"test@example.com\",\"password\":\"Test123!\",\"confirmPassword\":\"Test123!\"}'"
    echo ""
    echo "Login: curl -X POST http://localhost:8080/api/v1/auth/login \\"
    echo "  -H 'Content-Type: application/json' \\"
    echo "  -d '{\"email\":\"test@example.com\",\"password\":\"Test123!\"}'"
}

# Function to stop applications
stop_app() {
    echo "🛑 Stopping MelvinBank Zambia Application..."
    
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            echo "🔧 Backend stopped"
        fi
        rm -f backend.pid
    fi
    
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            echo "🎨 Frontend stopped"
        fi
        rm -f frontend.pid
    fi
    
    # Kill any remaining processes on ports 8080 and 5173
    pkill -f "spring-boot:run" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    
    echo "✅ Application stopped successfully"
}

# Main script logic
case "$1" in
    "stop")
        stop_app
        exit 0
        ;;
    "status")
        show_status
        exit 0
        ;;
    "restart")
        stop_app
        sleep 3
        ;;
    *)
        # Default: start the application
        ;;
esac

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Java
if ! java -version >/dev/null 2>&1; then
    echo "❌ Java is not installed or not in PATH"
    echo "Please install Java 17 or higher"
    exit 1
else
    echo "✅ Java is available"
fi

# Check Maven
if ! mvn -version >/dev/null 2>&1; then
    echo "❌ Maven is not installed or not in PATH"
    echo "Please install Maven 3.8 or higher"
    exit 1
else
    echo "✅ Maven is available"
fi

# Check Node.js
if ! node -v >/dev/null 2>&1; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js 16 or higher"
    exit 1
else
    echo "✅ Node.js is available"
fi

# Check npm
if ! npm -v >/dev/null 2>&1; then
    echo "❌ npm is not installed or not in PATH"
    echo "Please install npm"
    exit 1
else
    echo "✅ npm is available"
fi

echo ""

# Start applications
start_backend
if [ $? -eq 0 ]; then
    start_frontend
    if [ $? -eq 0 ]; then
        show_status
        echo ""
        echo "🎉 MelvinBank Zambia is now running!"
        echo "💡 Use '$0 stop' to stop the application"
        echo "💡 Use '$0 status' to check application status"
        echo "💡 Use '$0 restart' to restart the application"
        echo ""
        echo "📝 Logs:"
        echo "   Backend: tail -f backend.log"
        echo "   Frontend: tail -f frontend.log"
        echo ""
        echo "🌟 Visit http://localhost:5173 to access MelvinBank Zambia!"
    else
        echo "❌ Failed to start frontend. Stopping backend..."
        stop_app
        exit 1
    fi
else
    echo "❌ Failed to start backend."
    exit 1
fi