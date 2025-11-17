import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createItemInDay } from '@/lib/services/item';
import { z } from 'zod';

/**
 * POST /api/trips/days/[id]/items
 * 在指定 Day 中新增 Item
 */

const CreateItemSchema = z.object({
  type: z.enum(['flight', 'hotel', 'transfer', 'ski', 'lesson', 'todo', 'note', 'other']),
  title: z.string().min(1, '標題不能為空').max(200, '標題過長'),
  date: z.string().datetime().optional().nullable(),
  time: z.string().max(10).optional().nullable(),
  time_hint: z.enum(['morning', 'afternoon', 'evening', 'full_day']).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  link: z.string().max(500).optional().nullable(),
  note: z.string().max(1000).optional().nullable(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dayId } = await params;
    const body = await request.json();

    // 驗證輸入
    const validatedData = CreateItemSchema.parse(body);

    // 1. 找到包含此 Day 的 Trip
    const allTrips = await db.getAllTrips(''); // 獲取所有 trips

    let targetTrip = null;
    let targetDay = null;

    for (const trip of allTrips) {
      const day = trip.days.find((d) => d.id === dayId);
      if (day) {
        targetTrip = trip;
        targetDay = day;
        break;
      }
    }

    if (!targetTrip || !targetDay) {
      return NextResponse.json({ error: '找不到 Day' }, { status: 404 });
    }

    // 2. 使用 service 創建新 Item
    const newItem = createItemInDay({
      day_id: dayId,
      type: validatedData.type,
      title: validatedData.title,
      date: validatedData.date ? new Date(validatedData.date) : null,
      time: validatedData.time ?? null,
      time_hint: validatedData.time_hint ?? null,
      location: validatedData.location ?? null,
      link: validatedData.link ?? null,
      note: validatedData.note ?? null,
    });

    // 3. 將 Item 添加到 Day
    targetDay.items.push(newItem);

    // 4. 保存更新後的 Trip
    await db.updateTrip(targetTrip.id, targetTrip);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '輸入驗證失敗', details: error.issues },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
