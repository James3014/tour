import { useState, useEffect, useCallback } from 'react';
import { TripWithDetails, ChecklistItem, PackingItem, ItemData, DayData } from '@/lib/types/template';
import { tripApi } from '@/lib/api/client';

interface UseTripReturn {
    trip: TripWithDetails | null;
    checklist: ChecklistItem[];
    packing: PackingItem[];
    loading: boolean;
    error: string | null;
    actions: {
        refresh: () => Promise<void>;
        updateTrip: (data: Partial<TripWithDetails>) => Promise<void>;
        updateDay: (dayId: string, data: Partial<DayData>) => Promise<void>;
        updateItem: (itemId: string, data: Partial<ItemData>) => Promise<void>;
        deleteItem: (itemId: string) => Promise<void>;
        addItem: (dayId: string, data: Partial<ItemData>) => Promise<void>;
        toggleChecklist: (itemId: string) => Promise<void>;
        togglePacking: (itemId: string) => Promise<void>;
    };
}

export function useTrip(tripId: string): UseTripReturn {
    const [trip, setTrip] = useState<TripWithDetails | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [packing, setPacking] = useState<PackingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        if (!tripId) return;

        try {
            setLoading(true);
            const [tripData, checklistData, packingData] = await Promise.all([
                tripApi.getTrip(tripId),
                tripApi.getChecklist(tripId),
                tripApi.getPacking(tripId),
            ]);

            setTrip(tripData);
            setChecklist(checklistData);
            setPacking(packingData);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : '載入失敗');
        } finally {
            setLoading(false);
        }
    }, [tripId]);

    // Initial fetch
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const refresh = async () => {
        try {
            const updatedTrip = await tripApi.getTrip(tripId);
            setTrip(updatedTrip);
        } catch (err) {
            console.error('Refresh failed', err);
        }
    };

    // Generic optimistic update helper - eliminates special cases
    const withOptimistic = async (
        updater: (prev: TripWithDetails) => TripWithDetails,
        action: () => Promise<void>
    ) => {
        const previous = trip;
        setTrip((prev) => prev ? updater(prev) : null);
        try {
            await action();
            await refresh();
        } catch (err) {
            setTrip(previous);
            throw err;
        }
    };

    const updateTrip = (data: Partial<TripWithDetails>) =>
        withOptimistic(
            (prev) => ({ ...prev, ...data }),
            () => tripApi.updateTrip(tripId, data)
        );

    const updateDay = async (dayId: string, data: Partial<DayData>) => {
        await withOptimistic(
            (prev) => ({
                ...prev,
                days: prev.days.map((day) =>
                    day.id === dayId ? { ...day, ...data } : day
                ),
            }),
            async () => {
                await tripApi.updateDay(dayId, data);
            }
        );
    };

    const updateItem = (itemId: string, data: Partial<ItemData>) =>
        withOptimistic(
            (prev) => ({
                ...prev,
                days: prev.days.map((day) => ({
                    ...day,
                    items: day.items.map((item) =>
                        item.id === itemId ? { ...item, ...data } as ItemData : item
                    ),
                })),
            }),
            () => tripApi.updateItem(itemId, data)
        );

    const deleteItem = (itemId: string) =>
        withOptimistic(
            (prev) => ({
                ...prev,
                days: prev.days.map((day) => ({
                    ...day,
                    items: day.items.filter((item) => item.id !== itemId),
                })),
            }),
            () => tripApi.deleteItem(itemId)
        );

    const addItem = (dayId: string, data: Partial<ItemData>) =>
        withOptimistic(
            (prev) => ({
                ...prev,
                days: prev.days.map((day) =>
                    day.id === dayId
                        ? {
                            ...day,
                            items: [...day.items, {
                                ...data,
                                id: `temp-${Date.now()}`,
                                day_id: dayId,
                                type: data.type || 'other',
                                title: data.title || '',
                                created_at: new Date(),
                            } as ItemData]
                        }
                        : day
                ),
            }),
            () => tripApi.createItem(dayId, data)
        );

    const toggleChecklist = async (itemId: string) => {
        setChecklist((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        );

        try {
            await tripApi.toggleChecklist(itemId);
        } catch (err) {
            setChecklist((prev) =>
                prev.map((item) =>
                    item.id === itemId ? { ...item, completed: !item.completed } : item
                )
            );
            throw err;
        }
    };

    const togglePacking = async (itemId: string) => {
        setPacking((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        );

        try {
            await tripApi.togglePacking(itemId);
        } catch (err) {
            setPacking((prev) =>
                prev.map((item) =>
                    item.id === itemId ? { ...item, completed: !item.completed } : item
                )
            );
            throw err;
        }
    };

    return {
        trip,
        checklist,
        packing,
        loading,
        error,
        actions: {
            refresh,
            updateTrip,
            updateDay,
            updateItem,
            deleteItem,
            addItem,
            toggleChecklist,
            togglePacking,
        },
    };
}
