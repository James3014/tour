import { NextRequest, NextResponse } from 'next/server';
import { resortClient } from '@/lib/external/resort-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids') ?? searchParams.get('id');

    if (idsParam) {
      const ids = idsParam
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);

      const data = await resortClient.getResorts(ids);
      return NextResponse.json(Object.values(data));
    }

    const q = searchParams.get('q') ?? undefined;
    const region = searchParams.get('region') ?? undefined;
    const limit = Math.min(Number(searchParams.get('limit') ?? '10'), 50);

    const resorts = await resortClient.searchResorts({ q, region, limit });
    return NextResponse.json(resorts);
  } catch (error) {
    console.error('[api/resorts]', error);
    return NextResponse.json({ error: 'Failed to load resorts' }, { status: 500 });
  }
}
