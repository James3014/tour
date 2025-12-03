const USER_CORE_API_URL = process.env.USER_CORE_API_URL;

export async function syncSkiPreferences(params: {
    userId: string;
    resortIds: string[];
    tripId: string;
}) {
    if (!USER_CORE_API_URL) {
        return;
    }

    if (params.resortIds.length === 0) {
        return;
    }

    const url = `${USER_CORE_API_URL.replace(/\/$/, '')}/users/${params.userId}/ski-preferences`;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            resort_ids: params.resortIds,
            source: 'trip_planner',
            last_trip_id: params.tripId,
        }),
    }).catch((err) => {
        console.warn('[user-core] failed to sync ski preferences', err);
    });
}
