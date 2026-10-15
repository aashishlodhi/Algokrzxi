import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Single-user for now: no userId. When accounts arrive, add `userId` and widen the unique indexes.
const progressSchema = new Schema(
  { moduleSlug: { type: String, required: true }, lessonId: { type: String, required: true }, completed: { type: Boolean, default: false }, revision: { type: Boolean, default: false } },
  { timestamps: { createdAt: false, updatedAt: true } }
);
progressSchema.index({ moduleSlug: 1, lessonId: 1 }, { unique: true });

const noteSchema = new Schema({ moduleSlug: { type: String, required: true }, lessonId: { type: String, required: true }, body: { type: String, default: '' } }, { timestamps: true });
noteSchema.index({ moduleSlug: 1, lessonId: 1 }, { unique: true });

const feedbackSchema = new Schema({ moduleSlug: String, lessonId: String, type: { type: String, enum: ['error', 'unclear', 'suggestion'], default: 'suggestion' }, message: { type: String, required: true } }, { timestamps: true });

export const Progress = model('Progress', progressSchema);
export const Note = model('Note', noteSchema);
export const Feedback = model('Feedback', feedbackSchema);
