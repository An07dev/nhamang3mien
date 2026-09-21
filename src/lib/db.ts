import mongoose from 'mongoose';
import { connectDB } from './mongodb';
import Todo, { ITodo } from '@/models/Todo';
import { TodoItem, Priority } from '@/types';

function formatTodo(doc: ITodo): TodoItem {
  return {
    id: doc._id.toString(),
    title: doc.title,
    completed: doc.completed,
    priority: doc.priority,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
  };
}

class DatabaseService {
  private seeded = false;

  private async ensureSeed() {
    if (this.seeded) return;
    this.seeded = true;
    try {
      const count = await Todo.countDocuments();
      if (count === 0) {
        await Todo.insertMany([
          {
            title: 'Khám phá cấu trúc Backend (Route Handlers) trong Next.js',
            completed: true,
            priority: 'high',
            createdAt: new Date(Date.now() - 3600000 * 2),
          },
          {
            title: 'Xây dựng giao diện Frontend với Tailwind CSS & React Components',
            completed: true,
            priority: 'medium',
            createdAt: new Date(Date.now() - 3600000),
          },
          {
            title: 'Thử nghiệm Server Actions và REST API endpoints với MongoDB',
            completed: false,
            priority: 'high',
            createdAt: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error('Lỗi khi seed dữ liệu ban đầu vào MongoDB:', err);
    }
  }

  public async getAll(): Promise<TodoItem[]> {
    await connectDB();
    await this.ensureSeed();
    const todos = await Todo.find().sort({ createdAt: -1 }).lean<ITodo[]>();
    return todos.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      completed: t.completed,
      priority: t.priority,
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
    }));
  }

  public async getById(id: string): Promise<TodoItem | null> {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const todo = await Todo.findById(id);
    return todo ? formatTodo(todo) : null;
  }

  public async create(title: string, priority: Priority = 'medium'): Promise<TodoItem> {
    await connectDB();
    const newDoc = await Todo.create({
      title: title.trim(),
      priority,
      completed: false,
    });
    return formatTodo(newDoc);
  }

  public async toggle(id: string): Promise<TodoItem | null> {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    const todo = await Todo.findById(id);
    if (!todo) return null;
    todo.completed = !todo.completed;
    await todo.save();
    return formatTodo(todo);
  }

  public async delete(id: string): Promise<boolean> {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Todo.findByIdAndDelete(id);
    return !!result;
  }
}

// Preserve service instance in development across Fast Refresh
const globalForDb = globalThis as unknown as { dbService: DatabaseService | undefined };

export const db = globalForDb.dbService ?? new DatabaseService();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbService = db;
}
