# Multi-stage build for Spring Boot application
FROM maven:3.9-openjdk-21-slim AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:21-jdk-slim

WORKDIR /app

# Create non-root user for security
RUN groupadd -r melvinbank && useradd -r -g melvinbank melvinbank

# Copy the built JAR file
COPY --from=build /app/target/melvinbank-backend-*.jar app.jar

# Change ownership to non-root user
RUN chown melvinbank:melvinbank app.jar

# Switch to non-root user
USER melvinbank

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]