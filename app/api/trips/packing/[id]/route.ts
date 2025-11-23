import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { togglePackingItem } from '@/lib/services/checklist';
import { handleToggleItem } from '@/lib/api/toggle-item';

/**
 * PATCH /api/trips/packing/[id]
 * 切換 Packing 項目的勾選狀態
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleToggleItem(request, params, {
    getItemById: db.getPackingItemById.bind(db),
    updateItem: db.updatePackingItem.bind(db),
    toggleFn: togglePackingItem,
    resourceName: 'Packing 項目',
  });
}
