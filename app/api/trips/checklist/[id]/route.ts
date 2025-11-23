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

    // O(1) 直接查詢，消除 O(n) 遍歷
    const targetItem = await db.getChecklistItemById(id);

    if (!targetItem) {
      return NextResponse.json({ error: '找不到 Checklist 項目' }, { status: 404 });
    }

    // 切換狀態
    const updatedItem = toggleChecklistItem(targetItem);

    // 更新
    await db.updateChecklistItem(id, updatedItem);

    return NextResponse.json(updatedItem);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
