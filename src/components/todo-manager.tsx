'use client';

import { useState, useEffect, useTransition } from 'react';
import { TodoItem, Priority } from '@/types';
import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  Loader2,
  Layers,
  Zap,
  Tag,
} from 'lucide-react';
import {
  createTodoAction,
  toggleTodoAction,
  deleteTodoAction,
} from '@/actions/todo-actions';

interface TodoManagerProps {
  initialTodos?: TodoItem[];
}

export default function TodoManager({ initialTodos = [] }: TodoManagerProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [mode, setMode] = useState<'api' | 'server-actions'>('api');
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Tải danh sách khi khởi động nếu chưa có initialTodos
  useEffect(() => {
    if (initialTodos.length === 0) {
      fetchTodos();
    }
  }, [initialTodos.length]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/todos');
      const json = await res.json();
      if (json.success) {
        setTodos(json.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (mode === 'api') {
      try {
        setLoading(true);
        const res = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, priority }),
        });
        const json = await res.json();
        if (json.success) {
          setTodos((prev) => [json.data, ...prev]);
          setNewTitle('');
        }
      } catch (err) {
        console.error('Lỗi thêm todo qua API:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Dùng Server Action
      startTransition(async () => {
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('priority', priority);
        const result = await createTodoAction(formData);
        if (result.success && result.data) {
          setTodos((prev) => [result.data!, ...prev]);
          setNewTitle('');
        }
      });
    }
  };

  const handleToggle = async (id: string) => {
    if (mode === 'api') {
      try {
        const res = await fetch(`/api/todos/${id}`, { method: 'PATCH' });
        const json = await res.json();
        if (json.success) {
          setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
          );
        }
      } catch (err) {
        console.error('Lỗi toggle qua API:', err);
      }
    } else {
      startTransition(async () => {
        const result = await toggleTodoAction(id);
        if (result.success && result.data) {
          setTodos((prev) =>
            prev.map((t) => (t.id === id ? result.data! : t))
          );
        }
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (mode === 'api') {
      try {
        const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.success) {
          setTodos((prev) => prev.filter((t) => t.id !== id));
        }
      } catch (err) {
        console.error('Lỗi xoá qua API:', err);
      }
    } else {
      startTransition(async () => {
        const result = await deleteTodoAction(id);
        if (result.success) {
          setTodos((prev) => prev.filter((t) => t.id !== id));
        }
      });
    }
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'high':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            Cao
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
            Vừa
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            Thấp
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Quản lý công việc (Fullstack Demo)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Giao diện Frontend giao tiếp trực tiếp với Backend xử lý logic & dữ liệu
          </p>
        </div>

        {/* Chuyển đổi chế độ gọi BE */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setMode('api')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'api'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-blue-500" />
            REST API (/api/todos)
          </button>
          <button
            onClick={() => setMode('server-actions')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'server-actions'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Server Actions
          </button>
        </div>
      </div>

      {/* Form tạo mới Todo */}
      <form onSubmit={handleAddTodo} className="mt-5 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nhập công việc mới cần làm..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Độ ưu tiên: Thấp</option>
            <option value="medium">Độ ưu tiên: Vừa</option>
            <option value="high">Độ ưu tiên: Cao</option>
          </select>
          <button
            type="submit"
            disabled={loading || isPending || !newTitle.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
          >
            {loading || isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Thêm</span>
          </button>
        </div>
      </form>

      {/* Danh sách Todos */}
      <div className="mt-6 space-y-2.5">
        {loading && todos.length === 0 ? (
          <div className="py-12 flex justify-center items-center text-zinc-400 gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            <span>Đang tải danh sách từ máy chủ...</span>
          </div>
        ) : todos.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-sm">
            Chưa có công việc nào. Hãy thêm công việc đầu tiên ở trên!
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                todo.completed
                  ? 'bg-zinc-50/60 dark:bg-zinc-800/30 border-zinc-200/60 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500'
                  : 'bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-indigo-300 dark:hover:border-zinc-600 shadow-xs'
              }`}
            >
              <div
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer select-none"
                onClick={() => handleToggle(todo.id)}
              >
                <button
                  type="button"
                  className="focus:outline-none transition-transform active:scale-90"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600 shrink-0 hover:text-indigo-400" />
                  )}
                </button>
                <span
                  className={`text-sm truncate ${
                    todo.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'font-medium'
                  }`}
                >
                  {todo.title}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                {getPriorityBadge(todo.priority)}
                <button
                  onClick={() => handleDelete(todo.id)}
                  title="Xoá"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer thống kê */}
      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          Tổng: <b className="text-zinc-800 dark:text-zinc-200">{todos.length}</b> mục | Đã hoàn thành:{' '}
          <b className="text-emerald-600 dark:text-emerald-400">
            {todos.filter((t) => t.completed).length}
          </b>
        </span>
        <span className="text-[11px] text-zinc-400">
          Chế độ hiện tại: <span className="font-mono font-medium text-indigo-500">{mode}</span>
        </span>
      </div>
    </div>
  );
}
