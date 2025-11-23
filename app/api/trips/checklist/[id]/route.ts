import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { toggleChecklistItem } from '@/lib/services/checklist';
import { handleToggleItem } from '@/lib/api/toggle-item';

/**
 * PATCH /api/trips/checklist/[id]
 * 切換 Checklist 項目的勾選狀態
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleToggleItem(request, params, {
    getItemById: db.getChecklistItemById.bind(db),
    updateItem: db.updateChecklistItem.bind(db),
    toggleFn: toggleChecklistItem,
    resourceName: 'Checklist 項目',
  });
}
