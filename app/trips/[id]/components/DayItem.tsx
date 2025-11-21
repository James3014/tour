import { useState } from 'react';
import { DayData, ItemData } from '@/lib/types/template';
import TripItem from './TripItem';
import ItemEditForm from './ItemEditForm';

interface DayItemProps {
    day: DayData & { items: ItemData[] };
    isExpanded: boolean;
    onToggle: () => void;
    onItemUpdate: (itemId: string, data: Partial<ItemData>) => Promise<void>;
    onItemDelete: (itemId: string) => Promise<void>;
    onItemAdd: (dayId: string, data: Partial<ItemData>) => Promise<void>;
}

export default function DayItem({
    day,
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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Day Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
            >
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    {day.day_index}
                </div>
                <div className="flex-1 text-left">
                    <h2 className="text-xl font-bold">{day.label}</h2>
                    {day.city && (
                        <p className="text-gray-500 text-sm">📍 {day.city}</p>
                    )}
                </div>
                {day.is_ski_day && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ⛷️ 滑雪日
                    </span>
                )}
                <span className="text-gray-400 text-2xl">
                    {isExpanded ? '−' : '+'}
                </span>
            </button>

            {/* Day Content */}
            {isExpanded && (
                <div className="border-t border-gray-200 p-4">
                    <div className="space-y-3">
                        {day.items.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">尚無行程項目</p>
                        ) : (
                            day.items.map((item) => (
                                <TripItem
                                    key={item.id}
                                    item={item}
                                    onUpdate={onItemUpdate}
                                    onDelete={onItemDelete}
                                />
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
