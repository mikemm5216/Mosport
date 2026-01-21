import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/venues - 取得場館列表
router.get('/', async (req, res) => {
    try {
        const { city } = req.query;

        let query = 'SELECT * FROM venues WHERE 1=1';
        const params = [];

        if (city) {
            query += ' AND city = $1';
            params.push(city);
        }

        query += ' ORDER BY qoe_score DESC, created_at DESC LIMIT 50';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching venues:', error);
        res.status(500).json({ error: 'Failed to fetch venues' });
    }
});

// GET /api/venues/:id - 取得單一場館詳情
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT 
        v.*,
        json_agg(
          json_build_object(
            'event_id', e.id,
            'event_title', e.title,
            'event_league', e.league,
            'start_time', e.start_time,
            'verification_status', ve.verification_status
          )
        ) FILTER (WHERE e.id IS NOT NULL) as events
      FROM venues v
      LEFT JOIN venue_events ve ON v.id = ve.venue_id
      LEFT JOIN events e ON ve.event_id = e.id AND e.start_time > NOW()
      WHERE v.id = $1
      GROUP BY v.id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching venue:', error);
        res.status(500).json({ error: 'Failed to fetch venue' });
    }
});

// POST /api/venues - 建立新場館（需要認證）
router.post('/', async (req, res) => {
    try {
        const { name, address, city, country, latitude, longitude, description } = req.body;

        // TODO: 加入認證中介層驗證 VENUE 角色

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const result = await db.query(
            `INSERT INTO venues (name, slug, address, city, country, latitude, longitude, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [name, slug, address, city, country, latitude, longitude, description]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating venue:', error);
        res.status(500).json({ error: 'Failed to create venue' });
    }
});

export default router;
