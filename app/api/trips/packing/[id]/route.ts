import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { togglePackingItem } from '@/lib/services/checklist';

/**
 * PATCH /api/trips/packing/[id]
 * 切換 Packing 項目的勾選狀態
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. 獲取所有 trips 並找到包含此 packing item 的 trip
    const allTrips = await db.getAllTrips();

    let targetItem = null;

    // 搜尋所有 trips 的 packing 來找到目標 item
    for (const trip of allTrips) {
      const packing = await db.getPackingByTripId(trip.id);
      const item = packing.find((p) => p.id === id);
      if (item) {
        targetItem = item;
        break;
      }
    }

    if (!targetItem) {
      return NextResponse.json({ error: '找不到 Packing 項目' }, { status: 404 });
    }

    // 2. 使用 service 切換狀態
    const updatedItem = togglePackingItem(targetItem);

    // 3. 使用 database interface 更新 packing item
    await db.updatePackingItem(id, updatedItem);

    return NextResponse.json(updatedItem);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
