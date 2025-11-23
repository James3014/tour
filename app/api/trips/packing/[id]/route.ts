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

    // O(1) 直接查詢，消除 O(n) 遍歷
    const targetItem = await db.getPackingItemById(id);

    if (!targetItem) {
      return NextResponse.json({ error: '找不到 Packing 項目' }, { status: 404 });
    }

    // 切換狀態
    const updatedItem = togglePackingItem(targetItem);

    // 更新
    await db.updatePackingItem(id, updatedItem);

    return NextResponse.json(updatedItem);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
