import express from 'express';
import db from '../db.js';

const router = express.Router();

// POST /api/auth/callback - OAuth callback 處理
router.post('/callback', async (req, res) => {
    try {
        const { code, provider, role } = req.body;

        // TODO: 實作真實 OAuth token 交換邏輯
        // 1. 使用 code 向 Google/Facebook/Zalo 交換 access_token
        // 2. 使用 access_token 取得用戶資料
        // 3. 儲存/更新用戶到資料庫
        // 4. 產生 JWT 或 session token

        // 暫時模擬成功
        const mockUser = {
            id: '550e8400-e29b-41d4-a716-446655440099',
            role: role || 'FAN',
            email: 'demo@mosport.app',
            name: 'Demo User',
            provider,
            isAuthenticated: true,
            isGuest: false,
        };

        res.json({
            success: true,
            user: mockUser,
            // TODO: 產生真實的 JWT token
            token: 'mock_jwt_token_' + Date.now(),
        });
    } catch (error) {
        console.error('Error in auth callback:', error);
        res.status(500).json({ error: 'Authentication failed' });
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
