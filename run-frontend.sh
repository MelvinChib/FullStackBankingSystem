#!/bin/bash

# Navigate to frontend directory
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=MelvinBank Zambia
EOF
fi

# Run Vite development server
npm run dev
