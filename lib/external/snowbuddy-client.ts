const BASE_URL = process.env.SNOWBUDDY_API_URL;

interface MatchingPreference {
    skill_level_min: number;
    skill_level_max: number;
    preferred_resorts: string[];
    preferred_regions: (string | null)[];
    availability: string[];
    seeking_role: 'buddy' | 'student' | 'coach';
    include_knowledge_score: boolean;
}

export async function requestSnowbuddyMatches(userId: string, preference: MatchingPreference) {
    if (!BASE_URL) return [];

    const base = BASE_URL.replace(/\/$/, '');
    const searchId = await startSearch(base, userId, preference);
    if (!searchId) return [];

    const results = await pollResults(base, userId, searchId);
    return results;
}

async function startSearch(base: string, userId: string, preference: MatchingPreference) {
    const response = await fetch(`${base}/matching/searches`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Id': userId,
        },
        body: JSON.stringify(preference),
    });

    if (!response.ok) {
        console.warn('[snowbuddy] failed to start search', await response.text());
        return null;
    }
    const data = await response.json();
    return data.search_id as string;
}

async function pollResults(base: string, userId: string, searchId: string) {
    const maxAttempts = 6;
    const delayMs = 500;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const results = await fetchResults(base, userId, searchId);
        if (results?.status === 'completed') {
            return results.results ?? [];
        }
        await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return [];
}

async function fetchResults(base: string, userId: string, searchId: string) {
    const res = await fetch(`${base}/matching/searches/${searchId}`, {
        headers: {
            'X-User-Id': userId,
        },
    });

    if (!res.ok) {
        return null;
    }
    return res.json();
}
