import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GetTripByIdSchema } from '@/lib/validation/schemas';
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

    // 驗證輸入
    const validatedData = GetTripByIdSchema.parse({ id });

    const trip = await db.getTripById(validatedData.id);

    if (!trip) {
      return NextResponse.json({ error: '找不到旅程' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '輸入驗證失敗', details: error.issues },
        { status: 400 }
      );
    }

    // 其他錯誤
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
