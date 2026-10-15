import { Router } from 'express';
import { z } from 'zod';
import { Feedback, Note, Progress } from './models.js';

const slug = z.string().regex(/^[a-z0-9_-]{1,80}$/i);
const progressBody = z.object({ moduleSlug: slug, lessonId: slug, completed: z.boolean().optional(), revision: z.boolean().optional() });
const noteBody = z.object({ body: z.string().max(20000) });
const feedbackBody = z.object({ moduleSlug: slug.optional(), lessonId: slug.optional(), type: z.enum(['error', 'unclear', 'suggestion']), message: z.string().trim().min(3).max(2000) });

const wrap = (fn) => async (req, res) => {
  try { await fn(req, res); } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: 'Invalid input', issues: e.issues });
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
};

const r = Router();
r.get('/health', (_q, res) => res.json({ ok: true }));

r.get('/progress', wrap(async (_q, res) => res.json(await Progress.find().select('-_id -__v').lean())));
r.put('/progress', wrap(async (req, res) => {
  const { moduleSlug, lessonId, ...flags } = progressBody.parse(req.body);
  const doc = await Progress.findOneAndUpdate({ moduleSlug, lessonId }, { $set: flags }, { upsert: true, new: true, setDefaultsOnInsert: true }).select('-_id -__v').lean();
  res.json(doc);
}));

r.get('/notes/:moduleSlug/:lessonId', wrap(async (req, res) => {
  const { moduleSlug, lessonId } = z.object({ moduleSlug: slug, lessonId: slug }).parse(req.params);
  const n = await Note.findOne({ moduleSlug, lessonId }).lean();
  res.json({ body: n?.body ?? '' });
}));
r.put('/notes/:moduleSlug/:lessonId', wrap(async (req, res) => {
  const { moduleSlug, lessonId } = z.object({ moduleSlug: slug, lessonId: slug }).parse(req.params);
  const { body } = noteBody.parse(req.body);
  await Note.findOneAndUpdate({ moduleSlug, lessonId }, { $set: { body } }, { upsert: true });
  res.json({ ok: true });
}));

r.post('/feedback', wrap(async (req, res) => {
  await Feedback.create(feedbackBody.parse(req.body));
  res.status(201).json({ ok: true });
}));

export default r;
