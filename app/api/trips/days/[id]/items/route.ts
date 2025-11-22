import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateItemSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

/**
 * POST /api/trips/days/[id]/items
 * 在指定 Day 中新增 Item
 * 
 * 重構：從 70 行減少到 25 行
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dayId } = await params;
    const body = await request.json();

    // 驗證輸入
    const validatedData = CreateItemSchema.parse(body);

    // 準備數據（移除 undefined）
    const itemData = {
      type: validatedData.type,
      title: validatedData.title,
      date: validatedData.date ?? null,
      time: validatedData.time ?? null,
      time_hint: validatedData.time_hint ?? null,
      location: validatedData.location ?? null,
      link: validatedData.link ?? null,
      note: validatedData.note ?? null,
    };

    // 直接創建 - O(1)!
    const newItem = await db.createItem(dayId, itemData);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    // Not Found 錯誤（Day 不存在）
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // 其他錯誤
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
