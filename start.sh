#!/bin/bash

# Notes Management System - Frontend Startup Script
# For Linux/macOS

set -e

echo "========================================="
echo "Notes Management System - Frontend"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 20 or higher from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if Docker is installed (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker version: $(docker --version)"
    HAS_DOCKER=true
else
    echo "⚠️  Docker is not installed (optional)"
    HAS_DOCKER=false
fi

echo ""
echo "Choose an option:"
echo "1) Install dependencies and run development server"
echo "2) Build and run production server (local)"
echo "3) Build and run with Docker"
echo "4) Run tests"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Installing dependencies..."
        npm install
        
        echo ""
        echo "Creating .env file from example..."
        if [ ! -f .env ]; then
            cp .env.example .env
            echo ".env file created. Please configure it with your backend API URL."
        else
            echo ".env file already exists."
        fi
        
        echo ""
        echo "Starting development server..."
        npm run dev
        ;;
    
    2)
        echo ""
        echo "Installing dependencies..."
        npm install
        
        echo ""
        echo "Creating .env file from example..."
        if [ ! -f .env ]; then
            cp .env.example .env
        fi
        
        echo ""
        echo "Building production bundle..."
        npm run build
        
        echo ""
        echo "Starting production server..."
        npm run start
        ;;
    
    3)
        if [ "$HAS_DOCKER" = false ]; then
            echo ""
            echo "Docker is not installed!"
            echo "Please install Docker from https://www.docker.com/"
            exit 1
        fi
        
        echo ""
        echo "Creating .env file from example..."
        if [ ! -f .env ]; then
            cp .env.example .env
        fi
        
        echo ""
        echo "Building Docker image..."
        docker-compose build
        
        echo ""
        echo "Starting container..."
        docker-compose up
        ;;
    
    4)
        echo ""
        echo "Installing dependencies..."
        npm install
        
        echo ""
        echo "Running tests..."
        npm run test
        ;;
    
    *)
        echo ""
        echo "Invalid option!"
        exit 1
        ;;
esac
