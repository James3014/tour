import { TripWithDetails } from '@/lib/types/template';
import { collectResortIdsFromTrip } from '@/lib/utils/resort';
import { syncSkiPreferences } from '@/lib/external/user-core-client';

export async function syncUserResortPreferences(trip: TripWithDetails | null) {
    if (!trip) return;
    const resortIds = collectResortIdsFromTrip(trip);
    if (resortIds.length === 0) return;

    await syncSkiPreferences({
        userId: trip.user_id,
        resortIds,
        tripId: trip.id,
    });
}
