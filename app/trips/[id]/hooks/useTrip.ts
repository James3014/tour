import { useState, useEffect, useCallback } from 'react';
import { TripWithDetails, ChecklistItem, PackingItem, ItemData } from '@/lib/types/template';
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

    const updateTrip = async (data: Partial<TripWithDetails>) => {
        const previousTrip = trip;
        optimisticUpdate((prev) => ({ ...prev, ...data }));

        try {
            await tripApi.updateTrip(tripId, data);
            await refresh();
        } catch (err) {
            setTrip(previousTrip);
            throw err;
        }
    };

    // 樂觀更新輔助函數
    const optimisticUpdate = (updater: (prev: TripWithDetails) => TripWithDetails) => {
        setTrip((prev) => (prev ? updater(prev) : null));
    };

    const updateItem = async (itemId: string, data: Partial<ItemData>) => {
        // 1. 樂觀更新 UI
        const previousTrip = trip;
        optimisticUpdate((prev) => ({
            ...prev,
            days: prev.days.map((day) => ({
                ...day,
                items: day.items.map((item) =>
                    item.id === itemId ? { ...item, ...data } as ItemData : item
                ),
            })),
        }));

        try {
            // 2. 發送請求
            await tripApi.updateItem(itemId, {
                ...data,
                date: data.date || null,
                time: data.time || null,
            });

            // 3. 後台靜默刷新以確保數據一致
            await refresh();
        } catch (err) {
            // 4. 失敗回滾
            setTrip(previousTrip);
            throw err;
        }
    };

    const deleteItem = async (itemId: string) => {
        const previousTrip = trip;
        optimisticUpdate((prev) => ({
            ...prev,
            days: prev.days.map((day) => ({
                ...day,
                items: day.items.filter((item) => item.id !== itemId),
            })),
        }));

        try {
            await tripApi.deleteItem(itemId);
            await refresh();
        } catch (err) {
            setTrip(previousTrip);
            throw err;
        }
    };

    const addItem = async (dayId: string, data: Partial<ItemData>) => {
        // 1. 創建臨時 Item 用於樂觀更新
        const tempItem: ItemData = {
            id: `temp-${Date.now()}`, // 臨時 ID，後端會返回真實 ID
            day_id: dayId,
            type: data.type || 'other',
            title: data.title || '',
            date: data.date || null,
            time: data.time || null,
            time_hint: data.time_hint || null,
            location: data.location || null,
            link: data.link || null,
            note: data.note || null,
            created_at: new Date(),
        };

        // 2. 樂觀更新 UI - 立即顯示新 Item
        const previousTrip = trip;
        optimisticUpdate((prev) => ({
            ...prev,
            days: prev.days.map((day) =>
                day.id === dayId
                    ? { ...day, items: [...day.items, tempItem] }
                    : day
            ),
        }));

        try {
            // 3. 發送請求
            await tripApi.createItem(dayId, {
                ...data,
                date: data.date || null,
                time: data.time || null,
            });

            // 4. 刷新以獲取真實 ID
            await refresh();
        } catch (err) {
            // 5. 失敗回滾
            setTrip(previousTrip);
            throw err;
        }
    };

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
            updateItem,
            deleteItem,
            addItem,
            toggleChecklist,
            togglePacking,
        },
    };
}
