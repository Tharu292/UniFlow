import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['assignment', 'exam', 'project', 'quiz', 'presentation'], required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  description: { type: String, default: '' },
  resourceLink: { type: String, default: '' },
  module: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);