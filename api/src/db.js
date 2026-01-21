import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Neon requires SSL
    },
});

// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to Neon PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});

export default pool;
