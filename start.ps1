# Notes Management System - Frontend Startup Script
# For Windows (PowerShell)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Notes Management System - Frontend" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 20 or higher from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is installed (optional)
$hasDocker = $false
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker version: $dockerVersion" -ForegroundColor Green
    $hasDocker = $true
} catch {
    Write-Host "⚠️  Docker is not installed (optional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1) Install dependencies and run development server"
Write-Host "2) Build and run production server (local)"
Write-Host "3) Build and run with Docker"
Write-Host "4) Run tests"
Write-Host ""
$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "🔧 Creating .env file from example..." -ForegroundColor Yellow
        if (-not (Test-Path .env)) {
            Copy-Item .env.example .env
            Write-Host "✅ .env file created. Please configure it with your backend API URL." -ForegroundColor Green
        } else {
            Write-Host "ℹ️  .env file already exists." -ForegroundColor Blue
        }
        
        Write-Host ""
        Write-Host "🚀 Starting development server..." -ForegroundColor Green
        npm run dev
    }
    
    "2" {
        Write-Host ""
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "🔧 Creating .env file from example..." -ForegroundColor Yellow
        if (-not (Test-Path .env)) {
            Copy-Item .env.example .env
        }
        
        Write-Host ""
        Write-Host "🏗️  Building production bundle..." -ForegroundColor Yellow
        npm run build
        
        Write-Host ""
        Write-Host "🚀 Starting production server..." -ForegroundColor Green
        npm run start
    }
    
    "3" {
        if (-not $hasDocker) {
            Write-Host ""
            Write-Host "❌ Docker is not installed!" -ForegroundColor Red
            Write-Host "Please install Docker from https://www.docker.com/" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host ""
        Write-Host "🔧 Creating .env file from example..." -ForegroundColor Yellow
        if (-not (Test-Path .env)) {
            Copy-Item .env.example .env
        }
        
        Write-Host ""
        Write-Host "🐳 Building Docker image..." -ForegroundColor Yellow
        docker-compose build
        
        Write-Host ""
        Write-Host "🚀 Starting container..." -ForegroundColor Green
        docker-compose up
    }
    
    "4" {
        Write-Host ""
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        npm install
        
        Write-Host ""
        Write-Host "🧪 Running tests..." -ForegroundColor Yellow
        npm run test
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Invalid option!" -ForegroundColor Red
        exit 1
    }
}
