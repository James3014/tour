import { ItemData } from '@/lib/types/template';

const TIME_HINT_ORDER: Record<string, number> = {
    morning: 1,
    afternoon: 2,
    evening: 3,
    full_day: 4,
};

export function sortTripItems(items: ItemData[]): ItemData[] {
    return [...items].sort((a, b) => {
        // 1. 具體時間優先
        if (a.time && b.time) return a.time.localeCompare(b.time);
        if (a.time && !b.time) return -1; // 有時間的排前面
        if (!a.time && b.time) return 1;

        // 2. 時段排序 (morning < afternoon < evening < full_day < null)
        const aOrder = a.time_hint ? TIME_HINT_ORDER[a.time_hint] || 99 : 99;
        const bOrder = b.time_hint ? TIME_HINT_ORDER[b.time_hint] || 99 : 99;

        if (aOrder !== bOrder) return aOrder - bOrder;

        // 3. 最後依創建時間排序（保持穩定性）
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
}
