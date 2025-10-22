#!/bin/bash

# Set JAVA_HOME to Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="/opt/homebrew/bin:$PATH"

# Navigate to backend directory
cd backend

# Run Spring Boot application
mvn spring-boot:run -Dspring-boot.run.profiles=test
