import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiResponse, TodoItem, Priority } from '@/types';

// GET /api/todos - Lấy danh sách todos từ MongoDB
export async function GET() {
  try {
    const todos = await db.getAll();
    const response: ApiResponse<TodoItem[]> = {
      success: true,
      data: todos,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal Server Error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/todos - Tạo mới một todo vào MongoDB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.title !== 'string' || body.title.trim().length === 0) {
      const response: ApiResponse = {
        success: false,
        error: 'Tiêu đề (title) là bắt buộc và không được để trống.',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const priority: Priority = ['low', 'medium', 'high'].includes(body.priority)
      ? body.priority
      : 'medium';

    const newTodo = await db.create(body.title, priority);

    const response: ApiResponse<TodoItem> = {
      success: true,
      data: newTodo,
      message: 'Tạo công việc thành công.',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal Server Error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
