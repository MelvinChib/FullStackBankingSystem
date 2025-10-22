# Multi-stage build for React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL=http://localhost:8080/api/v1
ARG VITE_APP_NAME="MelvinBank Zambia"

# Set environment variables
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

# Build the application
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Create non-root user for security
RUN addgroup -g 1001 -S melvinbank && \
    adduser -S melvinbank -u 1001

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Change ownership to non-root user
RUN chown -R melvinbank:melvinbank /usr/share/nginx/html && \
    chown -R melvinbank:melvinbank /var/cache/nginx && \
    chown -R melvinbank:melvinbank /var/log/nginx && \
    chown -R melvinbank:melvinbank /etc/nginx/conf.d

# Create nginx pid directory
RUN mkdir -p /var/run/nginx && \
    chown -R melvinbank:melvinbank /var/run/nginx

# Switch to non-root user
USER melvinbank

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]