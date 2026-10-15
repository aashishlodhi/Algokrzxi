// Builds indexes and adds one sample progress row so the API has something to return.
import 'dotenv/config';
import mongoose from 'mongoose';
import { Feedback, Note, Progress } from './models.js';

await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/algokrzxi');
await Promise.all([Progress.syncIndexes(), Note.syncIndexes(), Feedback.syncIndexes()]);
await Progress.updateOne({ moduleSlug: 'embedded-c', lessonId: 'fixed-width-types' }, { $set: { completed: true } }, { upsert: true });
console.log('Seeded.');
await mongoose.disconnect();
