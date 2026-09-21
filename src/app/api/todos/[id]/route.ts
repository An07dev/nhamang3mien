import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApiResponse, TodoItem } from '@/types';

// PATCH /api/todos/[id] - Chuyển đổi trạng thái hoàn thành
export async function PATCH(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;

    const updated = await db.toggle(id);
    if (!updated) {
      const response: ApiResponse = {
        success: false,
        error: `Không tìm thấy công việc với id: ${id}`,
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<TodoItem> = {
      success: true,
      data: updated,
      message: 'Cập nhật trạng thái thành công.',
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

// DELETE /api/todos/[id] - Xoá công việc
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;

    const deleted = await db.delete(id);
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: `Không tìm thấy công việc với id: ${id}`,
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Xoá công việc thành công.',
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
