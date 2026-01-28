"""
Database Migration and Seed Executor
Executes SQL files to Railway/Neon production database
"""
import os
import psycopg2
from pathlib import Path

# Database connection - 從環境變數讀取或手動設定
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    DATABASE_URL = input("請貼上 Railway DATABASE_URL: ").strip()

def execute_sql_file(cursor, filepath):
    """Execute a SQL file"""
    print(f"\n>> Executing: {filepath.name}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        sql = f.read()
    
    try:
        cursor.execute(sql)
        print(f"[OK] {filepath.name} executed successfully")
        return True
    except Exception as e:
        print(f"[ERROR] Error in {filepath.name}: {e}")
        return False

def main():
    print("=== Mosport Database Migration & Seed ===")
    print("=" * 50)
    
    # Connect to database
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = False  # Use transactions
        cursor = conn.cursor()
        print("[OK] Connected to production database")
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return
    
    # Define SQL files to execute (in order)
    base_path = Path(__file__).parent
    migrations_path = base_path / "migrations"
    seeds_path = base_path / "seeds"
    
    sql_files = [
        # base_path / "schema.sql",
        # migrations_path / "002_v6_1_schema_update.sql",
        migrations_path / "003_pan_asia_expansion.sql",
        seeds_path / "002_asian_cities_data.sql"
    ]
    
    # Execute each file
    success_count = 0
    for sql_file in sql_files:
        if not sql_file.exists():
            print(f"[WARNING] File not found: {sql_file}")
            continue
        
        if execute_sql_file(cursor, sql_file):
            conn.commit()
            success_count += 1
        else:
            conn.rollback()
            print(f"[ROLLBACK] Rolled back {sql_file.name}")
            break  # Stop on first error
    
    # Summary
    print("\n" + "=" * 50)
    print(f"[SUMMARY] {success_count}/{len(sql_files)} files executed")
    
    # Verification queries
    if success_count > 0:
        print("\n[VERIFICATION]")
        
        # Count venues by country
        cursor.execute("""
            SELECT country, COUNT(*) as venue_count 
            FROM venues 
            GROUP BY country 
            ORDER BY country
        """)
        
        print("\nVenues by Country:")
        for row in cursor.fetchall():
            print(f"  {row[0]}: {row[1]} venues")
        
        # Total count
        cursor.execute("SELECT COUNT(*) FROM venues")
        total = cursor.fetchone()[0]
        print(f"\n[TOTAL] Total venues: {total}")
    
    # Close connection
    cursor.close()
    conn.close()
    print("\n[OK] Database connection closed")

if __name__ == "__main__":
    main()
