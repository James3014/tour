import { NextRequest, NextResponse } from 'next/server';
import { createTripFromTemplate } from '@/lib/services/trip';
import { createChecklistFromTemplate, createPackingFromTemplate } from '@/lib/services/checklist';
import { db } from '@/lib/db';
import { CreateTripSchema, GetTripsSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

/**
 * POST /api/trips
 * 從模板創建新旅程（包含 Checklist 和 Packing 清單）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证输入
    const validatedData = CreateTripSchema.parse(body);

    // 1. 創建 Trip
    const trip = createTripFromTemplate({
      template_id: validatedData.template_id,
      user_id: validatedData.user_id,
      title: validatedData.title,
      start_date: validatedData.start_date ? new Date(validatedData.start_date) : null,
      days: validatedData.days,
      people_count: validatedData.people_count ?? null,
      note: validatedData.note ?? null,
    });

    await db.createTrip(trip);

    // 2. 創建 Checklist 項目
    const checklistItems = createChecklistFromTemplate(
      validatedData.template_id,
      trip.id
    );
    if (checklistItems.length > 0) {
      await db.createChecklistItems(checklistItems);
    }

    // 3. 創建 Packing 項目
    const packingItems = createPackingFromTemplate(
      validatedData.template_id,
      trip.id
    );
    if (packingItems.length > 0) {
      await db.createPackingItems(packingItems);
    }

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    // Zod 验证错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入验证失败', details: error.issues },
        { status: 400 }
      );
    }

    // 其他错误
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/trips?user_id=xxx
 * 獲取用戶的所有旅程
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    // 验证输入
    const validatedData = GetTripsSchema.parse({ user_id: userId });

    const trips = await db.getAllTrips();

    return NextResponse.json(trips);
  } catch (error) {
    // Zod 验证错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '输入验证失败', details: error.issues },
        { status: 400 }
      );
    }

    // 其他错误
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
