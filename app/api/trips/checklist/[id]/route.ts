import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toggleChecklistItem } from '@/lib/services/checklist';

/**
 * PATCH /api/trips/checklist/[id]
 * 切換 Checklist 項目的勾選狀態
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. 獲取所有 trips 並找到包含此 checklist item 的 trip
    const allTrips = await db.getAllTrips();

    let targetItem = null;

    // 搜尋所有 trips 的 checklist 來找到目標 item
    for (const trip of allTrips) {
      const checklist = await db.getChecklistByTripId(trip.id);
      const item = checklist.find((c) => c.id === id);
      if (item) {
        targetItem = item;
        break;
      }
    }

    if (!targetItem) {
      return NextResponse.json({ error: '找不到 Checklist 項目' }, { status: 404 });
    }

    // 2. 使用 service 切換狀態
    const updatedItem = toggleChecklistItem(targetItem);

    // 3. 使用 database interface 更新 checklist item
    await db.updateChecklistItem(id, updatedItem);

    return NextResponse.json(updatedItem);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
