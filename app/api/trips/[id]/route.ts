import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/memory';

/**
 * GET /api/trips/:id
 * 獲取單個旅程詳情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trip = await db.getTripById(id);

    if (!trip) {
      return NextResponse.json({ error: '找不到旅程' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
