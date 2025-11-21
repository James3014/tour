import { TripWithDetails, ChecklistItem, PackingItem, ItemData } from '@/lib/types/template';

const BASE_URL = '/api/trips';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

export const tripApi = {
    getTrip: (id: string) => fetchJson<TripWithDetails>(`${BASE_URL}/${id}`),

    getChecklist: (id: string) => fetchJson<ChecklistItem[]>(`${BASE_URL}/${id}/checklist`).catch(() => []),

    getPacking: (id: string) => fetchJson<PackingItem[]>(`${BASE_URL}/${id}/packing`).catch(() => []),

    updateTrip: (id: string, data: Partial<TripWithDetails>) =>
        fetchJson<void>(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),

    createItem: (dayId: string, data: Partial<ItemData>) =>
        fetchJson<void>(`${BASE_URL}/days/${dayId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),

    updateItem: (itemId: string, data: Partial<ItemData>) =>
        fetchJson<void>(`${BASE_URL}/items/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }),

    deleteItem: (itemId: string) =>
        fetchJson<void>(`${BASE_URL}/items/${itemId}`, {
            method: 'DELETE',
        }),

    toggleChecklist: (itemId: string) =>
        fetchJson<void>(`${BASE_URL}/checklist/${itemId}`, {
            method: 'PATCH',
        }),

    togglePacking: (itemId: string) =>
        fetchJson<void>(`${BASE_URL}/packing/${itemId}`, {
            method: 'PATCH',
        }),
};
