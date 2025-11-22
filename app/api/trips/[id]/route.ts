import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GetTripByIdSchema, UpdateTripSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

/**
 * GET /api/trips/:id
 * 獲取單個旅程詳情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 验证输入
    const validatedData = GetTripByIdSchema.parse({ id });

    const trip = await db.getTripById(validatedData.id);

    if (!trip) {
      return NextResponse.json({ error: '找不到旅程' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    // Zod 验证错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入验证失败', details: error.issues },
        { status: 400 }
      );
    }

    // 其他错误
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/trips/:id
 * 更新旅程資訊
 * 
 * 重構：使用 Zod 替換手動驗證
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 驗證輸入
    const validatedData = UpdateTripSchema.parse(body);

    // 直接更新
    const updatedTrip = await db.updateTrip(id, validatedData);

    return NextResponse.json(updatedTrip);
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
 * DELETE /api/trips/:id
 * 刪除旅程
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.deleteTrip(id);

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
