import { useState, useEffect, useCallback } from 'react';
import { TripWithDetails, ChecklistItem, PackingItem, ItemData } from '@/lib/types/template';

interface UseTripReturn {
    trip: TripWithDetails | null;
    checklist: ChecklistItem[];
    packing: PackingItem[];
    loading: boolean;
    error: string | null;
    actions: {
        refresh: () => Promise<void>;
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
                fetch(`/api/trips/${tripId}`).then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch trip');
                    return res.json();
                }),
                fetch(`/api/trips/${tripId}/checklist`).then((res) => res.ok ? res.json() : []),
                fetch(`/api/trips/${tripId}/packing`).then((res) => res.ok ? res.json() : []),
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
            const updatedTrip = await fetch(`/api/trips/${tripId}`).then((res) => res.json());
            setTrip(updatedTrip);
        } catch (err) {
            console.error('Refresh failed', err);
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
            const response = await fetch(`/api/trips/items/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    date: data.date || null,
                    time: data.time || null,
                }),
            });

            if (!response.ok) throw new Error('Failed to update item');

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
            const response = await fetch(`/api/trips/items/${itemId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete item');
            await refresh();
        } catch (err) {
            setTrip(previousTrip);
            throw err;
        }
    };

    const addItem = async (dayId: string, data: Partial<ItemData>) => {
        // 新增項目較難做樂觀更新（因為沒有 ID），所以這裡只做標準請求
        // 如果需要極致體驗，可以生成臨時 ID，但複雜度會增加
        const response = await fetch(`/api/trips/days/${dayId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                date: data.date || null,
                time: data.time || null,
            }),
        });

        if (!response.ok) throw new Error('Failed to create item');
        await refresh();
    };

    const toggleChecklist = async (itemId: string) => {
        // 樂觀更新 Checklist
        setChecklist((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        );

        try {
            const response = await fetch(`/api/trips/checklist/${itemId}`, {
                method: 'PATCH',
            });

            if (!response.ok) throw new Error('Failed to toggle checklist item');
            // 不用刷新，因為我們已經知道結果了
        } catch (err) {
            // 回滾
            setChecklist((prev) =>
                prev.map((item) =>
                    item.id === itemId ? { ...item, completed: !item.completed } : item
                )
            );
            throw err;
        }
    };

    const togglePacking = async (itemId: string) => {
        // 樂觀更新 Packing
        setPacking((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
            )
        );

        try {
            const response = await fetch(`/api/trips/packing/${itemId}`, {
                method: 'PATCH',
            });

            if (!response.ok) throw new Error('Failed to toggle packing item');
        } catch (err) {
            // 回滾
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
            updateItem,
            deleteItem,
            addItem,
            toggleChecklist,
            togglePacking,
        },
    };
}
