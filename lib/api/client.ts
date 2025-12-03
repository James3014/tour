import { TripWithDetails, ChecklistItem, PackingItem, ItemData, DayData } from '@/lib/types/template';

const BASE_URL = '/api/trips';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

function serializeDayPayload(data: Partial<DayData>): Record<string, unknown> {
    const { resort_name, region, id, trip_id, ...rest } = data;
    return rest;
}

function serializeItemPayload(data: Partial<ItemData>): Record<string, unknown> {
    const { resort_name, region, id, day_id, created_at, ...rest } = data;
    return rest;
}

export const tripApi = {
    // Trip operations
    getTrip: (id: string) => fetchJson<TripWithDetails>(`${BASE_URL}/${id}`),

    updateTrip: (id: string, data: Partial<TripWithDetails>) =>
        fetchJson<void>(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),

    // Day operations - NEW!
    createDay: (tripId: string, data: Partial<DayData>) =>
        fetchJson<DayData>('/api/trips/days', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trip_id: tripId, ...serializeDayPayload(data) }),
        }),

    updateDay: (dayId: string, data: Partial<DayData>) =>
        fetchJson<DayData>(`/api/trips/days/${dayId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serializeDayPayload(data)),
        }),

    deleteDay: (dayId: string) =>
        fetchJson<void>(`/api/trips/days/${dayId}`, {
            method: 'DELETE',
        }),

    // Item operations
    createItem: (dayId: string, data: Partial<ItemData>) =>
        fetchJson<void>(`${BASE_URL}/days/${dayId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serializeItemPayload(data)),
        }),

    updateItem: (itemId: string, data: Partial<ItemData>) =>
        fetchJson<void>(`${BASE_URL}/items/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serializeItemPayload(data)),
        }),

    deleteItem: (itemId: string) =>
        fetchJson<void>(`${BASE_URL}/items/${itemId}`, {
            method: 'DELETE',
        }),

    // Checklist & Packing operations
    getChecklist: (id: string) => fetchJson<ChecklistItem[]>(`${BASE_URL}/${id}/checklist`).catch(() => []),

    getPacking: (id: string) => fetchJson<PackingItem[]>(`${BASE_URL}/${id}/packing`).catch(() => []),

    toggleChecklist: (itemId: string) =>
        fetchJson<void>(`${BASE_URL}/checklist/${itemId}`, {
            method: 'PATCH',
        }),

    togglePacking: (itemId: string) =>
        fetchJson<void>(`${BASE_URL}/packing/${itemId}`, {
            method: 'PATCH',
        }),
};
