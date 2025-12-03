import { resortClient, ResortMetadata } from '@/lib/external/resort-client';
import { TripWithDetails, DayData, ItemData } from '@/lib/types/template';
import { collectResortIdsFromTrip } from '@/lib/utils/resort';

export interface ResortFields {
  resort_id: string | null;
  resort_name: string | null;
  region: string | null;
}

export async function resolveResortMetadata(resortId: string | null): Promise<ResortFields> {
  if (!resortId) {
    return { resort_id: null, resort_name: null, region: null };
  }

  const metadata = await resortClient.getResort(resortId);
  if (!metadata) {
    throw new Error(`Resort ${resortId} not found`);
  }

  return {
    resort_id: metadata.resort_id,
    resort_name: metadata.name,
    region: metadata.region,
  };
}

export async function enrichTripWithResorts(trip: TripWithDetails): Promise<TripWithDetails> {
  const ids = collectResortIdsFromTrip(trip);
  if (ids.length === 0) {
    return trip;
  }

  const metadataMap = await resortClient.getResorts(ids);
  const missing = ids.filter((id) => !metadataMap[id]);
  if (missing.length > 0) {
    throw new Error(`Unknown resort ids: ${missing.join(', ')}`);
  }

  return {
    ...trip,
    days: trip.days.map((day) => applyMetadataToDay(day, metadataMap)),
  };
}

export const collectResortIds = collectResortIdsFromTrip;

function applyMetadataToDay(day: DayData & { items: ItemData[] }, map: Record<string, ResortMetadata>) {
  const updatedDay: DayData & { items: ItemData[] } = {
    ...day,
    resort_name: day.resort_id ? map[day.resort_id]?.name ?? day.resort_name ?? null : null,
    region: day.resort_id ? map[day.resort_id]?.region ?? day.region ?? null : null,
  };

  updatedDay.items = day.items.map((item) => ({
    ...item,
    resort_name: item.resort_id ? map[item.resort_id]?.name ?? item.resort_name ?? null : null,
    region: item.resort_id ? map[item.resort_id]?.region ?? item.region ?? null : null,
  }));

  return updatedDay;
}
