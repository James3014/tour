import { TripWithDetails } from '@/lib/types/template';

export function collectResortIdsFromTrip(trip: TripWithDetails | null): string[] {
    if (!trip) return [];
    const ids: string[] = [];
    trip.days.forEach((day) => {
        if (day.resort_id && !ids.includes(day.resort_id)) {
            ids.push(day.resort_id);
        }
        day.items.forEach((item) => {
            if (item.resort_id && !ids.includes(item.resort_id)) {
                ids.push(item.resort_id);
            }
        });
    });
    return ids;
}
