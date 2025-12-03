import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requestSnowbuddyMatches } from '@/lib/external/snowbuddy-client';

const RequestSchema = z.object({
    user_id: z.string().min(1),
    resort_ids: z.array(z.string()).default([]),
    regions: z.array(z.string().nullable()).optional(),
});

export async function POST(request: NextRequest) {
    if (!process.env.SNOWBUDDY_API_URL) {
        return NextResponse.json({ matches: [] });
    }

    try {
        const body = await request.json();
        const { user_id, resort_ids, regions } = RequestSchema.parse(body);

        if (resort_ids.length === 0) {
            return NextResponse.json({ matches: [] });
        }

        const preference = {
            skill_level_min: 1,
            skill_level_max: 10,
            preferred_resorts: resort_ids,
            preferred_regions: regions ?? [],
            availability: [],
            seeking_role: 'buddy' as const,
            include_knowledge_score: true,
        };

        const matches = await requestSnowbuddyMatches(user_id, preference);
        return NextResponse.json({ matches });
    } catch (error) {
        console.error('[matching/recommendations]', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid payload', details: error.issues }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to load recommendations' }, { status: 500 });
    }
}
