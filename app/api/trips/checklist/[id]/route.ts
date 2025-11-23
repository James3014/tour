import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toggleChecklistItem } from '@/lib/services/checklist';
import { handleApiError, notFound } from '@/lib/api/errors';

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

    // O(1) 直接查詢
    const targetItem = await db.getChecklistItemById(id);
    if (!targetItem) throw notFound('Checklist 項目');

    // 切換狀態並更新
    const updatedItem = toggleChecklistItem(targetItem);
    await db.updateChecklistItem(id, updatedItem);

    return NextResponse.json(updatedItem);
  } catch (error) {
    return handleApiError(error);
  }
}
