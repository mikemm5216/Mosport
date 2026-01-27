#!/bin/bash
# Seed database with initial test data

echo "🌱 Seeding database with test data..."

psql $DATABASE_URL -f ../database/seeds/001_initial_data.sql

if [ $? -eq 0 ]; then
    echo "✅ Seed data inserted successfully"
else
    echo "❌ Seed data insertion failed"
    exit 1
fi
