import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/trips/[id]/checklist
 * 獲取旅程的 Checklist 項目
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const checklist = await db.getChecklistByTripId(id);
    return NextResponse.json(checklist);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
