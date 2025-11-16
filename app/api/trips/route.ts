import { NextRequest, NextResponse } from 'next/server';
import { createTripFromTemplate } from '@/lib/services/trip';
import { db } from '@/lib/db/memory';

/**
 * POST /api/trips
 * 從模板創建新旅程
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template_id, user_id, title } = body;

    if (!template_id || !user_id) {
      return NextResponse.json(
        { error: '缺少必要參數: template_id, user_id' },
        { status: 400 }
      );
    }

    const trip = createTripFromTemplate({
      template_id,
      user_id,
      title,
    });

    await db.createTrip(trip);

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
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

    if (!userId) {
      return NextResponse.json(
        { error: '缺少參數: user_id' },
        { status: 400 }
      );
    }

    const trips = await db.getAllTrips(userId);

    return NextResponse.json(trips);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
