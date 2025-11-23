import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UpdateItemSchema } from '@/lib/validation/schemas';
import { handleApiError } from '@/lib/api/errors';

/**
 * PATCH /api/trips/items/[id]
 * 更新單個 Item
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = UpdateItemSchema.parse(body);

    const updatedItem = await db.updateItem(id, validatedData);
    return NextResponse.json(updatedItem);
  } catch (error) {
    return handleApiError(error);
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
    await db.deleteItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
