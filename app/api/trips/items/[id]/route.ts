import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UpdateItemSchema } from '@/lib/validation/schemas';
import { handleApiError } from '@/lib/api/errors';
import { syncUserResortPreferences } from '@/lib/services/preference-sync';
import { resolveResortMetadata } from '@/lib/services/resort-metadata';

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
    const { resort_id, ...rest } = validatedData;
    let payload = { ...rest };

    const existingItem = await db.getItemById(id);
    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if ('resort_id' in validatedData) {
      const meta = await resolveResortMetadata(resort_id ?? null);
      payload = { ...payload, ...meta };
    }

    const updatedItem = await db.updateItem(id, payload);
    const parentDay = await db.getDayById(updatedItem.day_id);
    const trip = parentDay ? await db.getTripById(parentDay.trip_id) : null;
    await syncUserResortPreferences(trip);
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
    const existingItem = await db.getItemById(id);
    if (!existingItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await db.deleteItem(id);
    const parentDay = await db.getDayById(existingItem.day_id);
    const trip = parentDay ? await db.getTripById(parentDay.trip_id) : null;
    await syncUserResortPreferences(trip);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
