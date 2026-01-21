import express from 'express';
import db from '../db.js';

const router = express.Router();

// POST /api/auth/callback - OAuth callback handling
router.post('/callback', async (req, res) => {
    try {
        const { code, provider, role } = req.body;

        // NOTE: In a real production environment, you would:
        // 1. Exchange 'code' for 'access_token' via the Provider's API (Google/FB/Zalo)
        // 2. Use 'access_token' to fetch the user's profile (email, name, picture)
        // 3. Verify the signature/claims

        // --- SIMULATION START ---
        // For this phase, we simulate the profile fetch. 
        // We defer the actual OAuth exchange until we have the Client Secrets configured in .env
        const mockProfile = {
            email: `user_${code.substring(0, 5)}@example.com`, // Simulate unique email based on code
            name: `User ${code.substring(0, 5)}`,
            picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${code}`,
            provider_id: `pid_${code}`
        };
        
        // If it's a "Demo" login (often used in dev), we can fallback to fixed credentials
        if (code === 'DEMO_CODE') {
            mockProfile.email = 'demo@mosport.app';
            mockProfile.name = 'Demo User';
        }
        // --- SIMULATION END ---

        // 3. Upsert User into Database
        // We use ON CONFLICT to update if email already exists
        const query = `
            INSERT INTO users (role, email, name, picture_url, provider, is_guest, updated_at)
            VALUES ($1, $2, $3, $4, $5, false, NOW())
            ON CONFLICT (email) 
            DO UPDATE SET 
                name = EXCLUDED.name,
                picture_url = EXCLUDED.picture_url,
                updated_at = NOW()
            RETURNING id, role, email, name, picture_url as picture, provider, is_guest, created_at
        `;

        const values = [
            role || 'FAN',
            mockProfile.email,
            mockProfile.name,
            mockProfile.picture,
            provider
        ];

        const { rows } = await db.query(query, values);
        const user = rows[0];

        // 4. Create Session/Token (Simplified)
        // In production, sign a proper JWT here
        const token = `mock_jwt_${user.id}_${Date.now()}`;

        res.json({
            success: true,
            user: {
                ...user,
                isAuthenticated: true
            },
            token
        });
    } catch (error) {
        console.error('Error in auth callback:', error);
        res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
});

// POST /api/auth/logout - 登出
router.post('/logout', async (req, res) => {
    try {
        // TODO: 清除 session 或使 JWT token 失效
        res.json({ success: true });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// GET /api/auth/me - 取得當前用戶資訊
router.get('/me', async (req, res) => {
    try {
        // TODO: 從 JWT token 或 session 取得用戶 ID
        // TODO: 從資料庫查詢用戶資料

        res.json({
            id: '550e8400-e29b-41d4-a716-446655440099',
            role: 'FAN',
            email: 'demo@mosport.app',
            name: 'Demo User',
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
});

export default router;
