
import sys
import os
import asyncio

# Add current directory to path so we can import 'app'
sys.path.append(os.getcwd())

print("Checking imports...")

try:
    print("1. Importing app.api.deps...")
    from app.api import deps
    print("   -> Success")
except Exception as e:
    print(f"   -> FAILED: {e}")

try:
    print("2. Importing app.db.init_db...")
    from app.db import init_db
    print("   -> Success")
except Exception as e:
    print(f"   -> FAILED: {e}")

try:
    print("3. Importing app.api.api_v1.endpoints.admin...")
    from app.api.api_v1.endpoints import admin
    print("   -> Success")
except Exception as e:
    print(f"   -> FAILED: {e}")

try:
    print("4. Importing app.main...")
    from app import main
    print("   -> Success")
except Exception as e:
    print(f"   -> FAILED: {e}")

print("Import check complete.")
