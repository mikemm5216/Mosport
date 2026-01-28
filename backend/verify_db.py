
import asyncio
import sys
import os

# Ensure backend directory is in python path
sys.path.append(os.getcwd())

from app.db.session import engine
from sqlalchemy import text

async def check():
    try:
        print("Connecting to database...")
        async with engine.connect() as connection:
            result = await connection.execute(text("SELECT 1"))
            print(f"Result: {result.scalar()}")
        print("✅ DB Connection OK")
    except Exception as e:
        print(f"❌ DB Connection Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(check())
