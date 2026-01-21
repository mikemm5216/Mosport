import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventsRouter from './routes/events.js';
import venuesRouter from './routes/venues.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/venues', venuesRouter);
app.use('/api/auth', authRouter);

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Mosport API Server running on http://localhost:${PORT}`);
});
