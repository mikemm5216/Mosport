import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET /api/events - 取得賽事列表
router.get('/', async (req, res) => {
    try {
        const { city, sport, from, to } = req.query;

        let query = `
      SELECT 
        e.*,
        json_agg(
          json_build_object(
            'venue_id', v.id,
            'venue_name', v.name,
            'venue_city', v.city,
            'verification_status', ve.verification_status,
            'qoe_score', v.qoe_score
          )
        ) FILTER (WHERE v.id IS NOT NULL) as venues
      FROM events e
      LEFT JOIN venue_events ve ON e.id = ve.event_id
      LEFT JOIN venues v ON ve.venue_id = v.id
      WHERE e.start_time > NOW()
    `;

        const params = [];
        let paramCount = 1;

        if (city) {
            query += ` AND v.city = $${paramCount}`;
            params.push(city);
            paramCount++;
        }

        if (sport) {
            query += ` AND e.sport = $${paramCount}`;
            params.push(sport);
            paramCount++;
        }

        if (from) {
            query += ` AND e.start_time >= $${paramCount}`;
            params.push(from);
            paramCount++;
        }

        if (to) {
            query += ` AND e.start_time <= $${paramCount}`;
            params.push(to);
            paramCount++;
        }

        query += ` GROUP BY e.id ORDER BY e.start_time ASC LIMIT 50`;

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// GET /api/events/:id - 取得單一賽事詳情
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM events WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

export default router;
