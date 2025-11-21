import { useState } from 'react';
import { DayData, ItemData } from '@/lib/types/template';
import TripItem from './TripItem';
import ItemEditForm from './ItemEditForm';
import { sortTripItems } from '@/lib/utils/sort';

interface DayItemProps {
    day: DayData & { items: ItemData[] };
    tripStartDate: Date | null;
    isExpanded: boolean;
    onToggle: () => void;
    onItemUpdate: (itemId: string, data: Partial<ItemData>) => Promise<void>;
    onItemDelete: (itemId: string) => Promise<void>;
    onItemAdd: (dayId: string, data: Partial<ItemData>) => Promise<void>;
}

export default function DayItem({
    day,
    tripStartDate,
    isExpanded,
    onToggle,
    onItemUpdate,
    onItemDelete,
    onItemAdd,
}: DayItemProps) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async (data: Partial<ItemData>) => {
        await onItemAdd(day.id, data);
        setIsAdding(false);
    };

    // 計算具體日期
    const dayDate = tripStartDate
        ? new Date(new Date(tripStartDate).setDate(new Date(tripStartDate).getDate() + (day.day_index - 1)))
        : null;

    const formattedDate = dayDate
        ? dayDate.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', weekday: 'short' })
        : null;

    // 自動排序邏輯
    const sortedItems = sortTripItems(day.items);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Day Header */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                        ▶
                    </span>
                    {/* 日期 Badge - 更醒目的顯示 */}
                    {formattedDate && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                            {formattedDate}
                        </span>
                    )}
                    <h3 className="font-bold text-lg">
                        {day.label}
                    </h3>
                    {day.city && (
                        <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded border">
                            {day.city}
                        </span>
                    )}
                    {day.is_ski_day && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ⛷️ 滑雪日
                        </span>
                    )}
                </div>
                <span className="text-sm text-gray-500">
                    {day.items.length} 個項目
                </span>
            </button>

            {/* Day Content */}
            {isExpanded && (
                <div className="border-t border-gray-200 p-4">
                    <div className="space-y-3">
                        {day.items.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">尚無行程項目</p>
                        ) : (
                            sortedItems.map((item) => (
                                <div key={item.id}>
                                    <TripItem
                                        item={item}
                                        onUpdate={onItemUpdate}
                                        onDelete={onItemDelete}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Item Form */}
                    {isAdding ? (
                        <div className="mt-3">
                            <ItemEditForm
                                mode="add"
                                onSave={handleAdd}
                                onCancel={() => setIsAdding(false)}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full mt-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            + 新增項目
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
