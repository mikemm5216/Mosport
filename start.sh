#!/bin/bash
# Railway Startup Script
# 1. Run database migrations
# 2. Start the backend server

echo "🚀 Mosport Backend Starting..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set!"
    exit 1
fi

# Run migrations
echo "📦 Running database migrations..."
psql $DATABASE_URL -f database/migrations/001_search_engine.sql

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "⚠️ Migration failed, but continuing..."
fi

# Start the server
echo "🔥 Starting Uvicorn..."
cd backend
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
