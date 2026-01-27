#!/bin/bash
# Seed database with initial test data

echo "🌱 Seeding database with test data..."

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute seed SQL from the correct path
psql $DATABASE_URL -f "$SCRIPT_DIR/../database/seeds/001_initial_data.sql"

if [ $? -eq 0 ]; then
    echo "✅ Seed data inserted successfully"
else
    echo "⚠️ Seed data insertion failed, but continuing..."
    exit 0  # Don't fail the deployment if seed fails
fi
