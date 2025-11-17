import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

/**
 * PATCH /api/trips/items/[id]
 * 更新單個 Item
 */

const UpdateItemSchema = z.object({
  type: z.enum(['flight', 'hotel', 'transfer', 'ski', 'lesson', 'todo', 'note', 'other']).optional(),
  title: z.string().min(1).max(200).optional(),
  date: z.string().datetime().optional().nullable(),
  time: z.string().max(10).optional().nullable(),  // 格式如 "14:30"
  time_hint: z.enum(['morning', 'afternoon', 'evening', 'full_day']).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  link: z.string().max(500).optional().nullable(),  // 允許任意字符串
  note: z.string().max(1000).optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 驗證輸入
    const validatedData = UpdateItemSchema.parse(body);

    // 1. 獲取原 Trip
    // 因為 MemoryDB 儲存整個 TripWithDetails，我們需要找到 Item 並更新
    // 這裡簡化實現：直接通過所有 trips 搜尋
    const allTrips = await db.getAllTrips(''); // 獲取所有（暫時）

    let targetTrip = null;
    let targetDay = null;
    let targetItem = null;

    for (const trip of allTrips) {
      for (const day of trip.days) {
        const item = day.items.find((i) => i.id === id);
        if (item) {
          targetTrip = trip;
          targetDay = day;
          targetItem = item;
          break;
        }
      }
      if (targetItem) break;
    }

    if (!targetTrip || !targetDay || !targetItem) {
      return NextResponse.json({ error: '找不到 Item' }, { status: 404 });
    }

    // 2. 更新 Item 資料
    const updatedItem = {
      ...targetItem,
      ...Object.fromEntries(
        Object.entries(validatedData).filter(([_, v]) => v !== undefined)
      ),
    };

    // 3. 更新 Day 中的 Item
    targetDay.items = targetDay.items.map((item) =>
      item.id === id ? updatedItem : item
    );

    // 4. 保存更新後的 Trip
    await db.updateTrip(targetTrip.id, targetTrip);

    return NextResponse.json(updatedItem);
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

/**
 * DELETE /api/trips/items/[id]
 * 刪除單個 Item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 找到並刪除 Item
    const allTrips = await db.getAllTrips('');

    let targetTrip = null;
    let targetDay = null;

    for (const trip of allTrips) {
      for (const day of trip.days) {
        const itemIndex = day.items.findIndex((i) => i.id === id);
        if (itemIndex !== -1) {
          targetTrip = trip;
          targetDay = day;
          day.items.splice(itemIndex, 1);
          break;
        }
      }
      if (targetDay) break;
    }

    if (!targetTrip) {
      return NextResponse.json({ error: '找不到 Item' }, { status: 404 });
    }

    await db.updateTrip(targetTrip.id, targetTrip);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
