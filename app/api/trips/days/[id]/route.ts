import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UpdateDaySchema } from '@/lib/validation/schemas';
import { z } from 'zod';

/**
 * PATCH /api/trips/days/[id]
 * 更新 Day
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 驗證輸入
    const validatedData = UpdateDaySchema.parse(body);

    // 直接更新
    const updatedDay = await db.updateDay(id, validatedData);

    return NextResponse.json(updatedDay);
  } catch (error) {
    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    // Not Found 錯誤
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // 其他錯誤
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/days/[id]
 * 刪除 Day（cascade delete Items，重排 day_index）
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 直接刪除（包含 cascade delete 和 reorder）
    await db.deleteDay(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    // Not Found 錯誤
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // 其他錯誤
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
