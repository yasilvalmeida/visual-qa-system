#!/bin/bash

echo "🚀 Setting up Visual QA System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Please install Yarn first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/uploads/images
mkdir -p frontend/public

# Copy environment files
echo "📝 Setting up environment files..."
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Backend environment file created"
else
    echo "ℹ️  Backend environment file already exists"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/env.example frontend/.env
    echo "✅ Frontend environment file created"
else
    echo "ℹ️  Frontend environment file already exists"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec -T postgres pg_isready -U visual_qa_user -d visual_qa_db; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL is ready"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
yarn install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
yarn install

# Build frontend
echo "🔨 Building frontend..."
yarn build

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend: cd backend && yarn start:dev"
echo "2. Start the frontend: cd frontend && yarn start"
echo "3. Access the application at http://localhost:3000"
echo "4. API documentation at http://localhost:3001/api/docs"
echo ""
echo "🔧 Configuration:"
echo "- Backend runs on http://localhost:3001"
echo "- Frontend runs on http://localhost:3000"
echo "- PostgreSQL runs on localhost:5432"
echo "- Redis runs on localhost:6379"
echo ""
echo "📚 For more information, see the README.md file" 