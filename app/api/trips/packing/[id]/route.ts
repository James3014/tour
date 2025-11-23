import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { togglePackingItem } from '@/lib/services/checklist';
import { handleApiError, notFound } from '@/lib/api/errors';

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

    // O(1) 直接查詢
    const targetItem = await db.getPackingItemById(id);
    if (!targetItem) throw notFound('Packing 項目');

    // 切換狀態並更新
    const updatedItem = togglePackingItem(targetItem);
    await db.updatePackingItem(id, updatedItem);

    return NextResponse.json(updatedItem);
  } catch (error) {
    return handleApiError(error);
  }
}
