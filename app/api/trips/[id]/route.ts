import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GetTripByIdSchema } from '@/lib/validation/schemas';
import { TripWithDetails } from '@/lib/types/template';
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
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 簡單驗證（之後可以加上 Zod）
    if (!id) {
      return NextResponse.json({ error: '缺少旅程 ID' }, { status: 400 });
    }

    // 準備更新數據
    const updateData: Partial<TripWithDetails> = {};

    if (body.title !== undefined) {
      updateData.title = body.title;
    }

    if (body.start_date !== undefined) {
      // 處理日期：接受字符串、Date 對象或 null
      if (body.start_date === null || body.start_date === '') {
        updateData.start_date = null;
      } else {
        const parsedDate = new Date(body.start_date);
        // 驗證日期是否有效
        if (!isNaN(parsedDate.getTime())) {
          updateData.start_date = parsedDate;
        }
      }
    }

    if (body.people_count !== undefined) {
      updateData.people_count = body.people_count;
    }

    if (body.note !== undefined) {
      updateData.note = body.note;
    }

    const updatedTrip = await db.updateTrip(id, updateData);

    return NextResponse.json(updatedTrip);
  } catch (error) {
    const message = error instanceof Error ? error.message : '更新失敗';
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

    if (!id) {
      return NextResponse.json({ error: '缺少旅程 ID' }, { status: 400 });
    }

    await db.deleteTrip(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '刪除失敗';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
