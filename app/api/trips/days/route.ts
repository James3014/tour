import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreateDaySchema } from '@/lib/validation/schemas';
import { z } from 'zod';
import { syncUserResortPreferences } from '@/lib/services/preference-sync';
import { resolveResortMetadata } from '@/lib/services/resort-metadata';

/**
 * POST /api/trips/days
 * 創建新的 Day
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 驗證輸入
    const validatedData = CreateDaySchema.parse(body);

    // 準備數據
    const resortMeta = await resolveResortMetadata(validatedData.resort_id ?? null);
    const dayData = {
      day_index: validatedData.day_index,
      label: validatedData.label,
      city: validatedData.city ?? null,
      is_ski_day: validatedData.is_ski_day,
      ...resortMeta,
    };

    // 直接創建
    const newDay = await db.createDay(validatedData.trip_id, dayData);
    const trip = await db.getTripById(validatedData.trip_id);
    await syncUserResortPreferences(trip);

    return NextResponse.json(newDay, { status: 201 });
  } catch (error) {
    // Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    // Resort 無效
    if (error instanceof Error && error.message.includes('Resort')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Not Found 錯誤（Trip 不存在）
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // 其他錯誤
    console.error('Unexpected error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
