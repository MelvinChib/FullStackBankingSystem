#!/bin/bash

# SwiftBank - JavaDoc Generation Script
# Author: Melvin Musonda Chibanda
# Version: 2.0.0

echo "========================================="
echo "SwiftBank - JavaDoc Generation"
echo "========================================="
echo ""

# Navigate to backend directory
cd backend || exit 1

echo "✓ Navigated to backend directory"
echo ""

# Clean previous builds
echo "Cleaning previous builds..."
mvn clean
echo "✓ Clean completed"
echo ""

# Generate JavaDoc
echo "Generating JavaDoc documentation..."
mvn javadoc:javadoc
echo "✓ JavaDoc generated successfully"
echo ""

# Check if JavaDoc was generated
if [ -d "target/site/apidocs" ]; then
    echo "========================================="
    echo "✓ JavaDoc Generation Complete!"
    echo "========================================="
    echo ""
    echo "📁 Location: backend/target/site/apidocs/"
    echo "🌐 Open: backend/target/site/apidocs/index.html"
    echo ""
    
    # Optional: Open in browser (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        read -p "Open JavaDoc in browser? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open target/site/apidocs/index.html
        fi
    fi
else
    echo "❌ Error: JavaDoc generation failed"
    exit 1
fi

echo ""
echo "========================================="
echo "Additional Commands:"
echo "========================================="
echo "Generate JavaDoc JAR: mvn javadoc:jar"
echo "Generate with sources: mvn source:jar javadoc:jar"
echo ""
