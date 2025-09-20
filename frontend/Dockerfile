# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Create .env file with build-time variables (Vite)
ARG VITE_API_URL=http://localhost:8080/api/v1
ARG VITE_APP_NAME="MelvinBank Zambia"
ARG VITE_APP_VERSION=1.0.0

# Write both Vite-style and CRA-style keys for compatibility
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env && \
    echo "VITE_APP_NAME=${VITE_APP_NAME}" >> .env && \
    echo "VITE_APP_VERSION=${VITE_APP_VERSION}" >> .env && \
    echo "REACT_APP_API_URL=${VITE_API_URL}" >> .env

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration with SPA fallback
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (default for nginx)
EXPOSE 80

# Health check (use explicit health endpoint)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
