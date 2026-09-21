'use server';

import { db } from '@/lib/db';
import { Priority, TodoItem } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getTodosAction(): Promise<TodoItem[]> {
  return await db.getAll();
}

export async function createTodoAction(
  formData: FormData
): Promise<{ success: boolean; data?: TodoItem; error?: string }> {
  try {
    const title = formData.get('title') as string;
    const priority = (formData.get('priority') as Priority) || 'medium';

    if (!title || title.trim().length === 0) {
      return { success: false, error: 'Tiêu đề không được để trống' };
    }

    const newTodo = await db.create(title, priority);
    revalidatePath('/');
    return { success: true, data: newTodo };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Lỗi khi tạo công việc' };
  }
}

export async function toggleTodoAction(
  id: string
): Promise<{ success: boolean; data?: TodoItem | null; error?: string }> {
  try {
    const updated = await db.toggle(id);
    if (!updated) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Lỗi khi cập nhật' };
  }
}

export async function deleteTodoAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const deleted = await db.delete(id);
    if (!deleted) {
      return { success: false, error: 'Không tìm thấy công việc' };
    }
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Lỗi khi xoá' };
  }
}
