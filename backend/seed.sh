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
fi

# Run Super Bowl Script
echo "🏈 Adding Super Bowl Event..."
python3 "$SCRIPT_DIR/add_super_bowl.py"
