import mongoose, { Schema, Document, Model } from 'mongoose';
import { Priority } from '@/types';

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Tiêu đề không được để trống'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Tránh lỗi OverwriteModelError khi Next.js reload
const Todo: Model<ITodo> = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

export default Todo;
