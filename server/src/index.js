import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import routes from './routes.js';

const { PORT = 5000, MONGODB_URI = 'mongodb://127.0.0.1:27017/algokrzxi', CLIENT_ORIGIN = 'http://localhost:5173' } = process.env;

const app = express();
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '100kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }), routes);

try {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
} catch (e) {
  console.error('MongoDB connection failed:', e.message);
  process.exit(1);
}
