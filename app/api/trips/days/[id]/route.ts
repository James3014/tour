import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UpdateDaySchema } from '@/lib/validation/schemas';
import { z } from 'zod';
import { syncUserResortPreferences } from '@/lib/services/preference-sync';
import { resolveResortMetadata } from '@/lib/services/resort-metadata';

/**
 * PATCH /api/trips/days/[id]
 * 更新 Day
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validatedData = UpdateDaySchema.parse(body);
    const { resort_id, ...rest } = validatedData;
    let payload = { ...rest };

    if ('resort_id' in validatedData) {
      const meta = await resolveResortMetadata(resort_id ?? null);
      payload = { ...payload, ...meta };
    }

    const updatedDay = await db.updateDay(id, payload);
    const trip = await db.getTripById(updatedDay.trip_id);
    await syncUserResortPreferences(trip);

    return NextResponse.json(updatedDay);
  } catch (error) {
    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    // Resort 錯誤
    if (error instanceof Error && error.message.includes('Resort')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Not Found 錯誤
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // 其他錯誤
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/trips/days/[id]
 * 刪除 Day（cascade delete Items，重排 day_index）
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const day = await db.getDayById(id);
    if (!day) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    await db.deleteDay(id);
    const trip = await db.getTripById(day.trip_id);
    await syncUserResortPreferences(trip);

    return NextResponse.json({ success: true });
  } catch (error) {
    // Not Found 錯誤
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // 其他錯誤
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
