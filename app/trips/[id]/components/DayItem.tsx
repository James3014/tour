import { useEffect, useState } from 'react';
import { DayData, ItemData } from '@/lib/types/template';
import TripItem from './TripItem';
import ItemEditForm from './ItemEditForm';
import { sortTripItems } from '@/lib/utils/sort';
import ResortSearchInput from '@/components/ResortSearchInput';
import type { ResortSummary } from '@/lib/types/resort';

interface DayItemProps {
    day: DayData & { items: ItemData[] };
    tripStartDate: Date | null;
    isExpanded: boolean;
    onToggle: () => void;
    onDayUpdate: (dayId: string, data: Partial<DayData>) => Promise<void>;
    onItemUpdate: (itemId: string, data: Partial<ItemData>) => Promise<void>;
    onItemDelete: (itemId: string) => Promise<void>;
    onItemAdd: (dayId: string, data: Partial<ItemData>) => Promise<void>;
}

export default function DayItem({
    day,
    tripStartDate,
    isExpanded,
    onToggle,
    onDayUpdate,
    onItemUpdate,
    onItemDelete,
    onItemAdd,
}: DayItemProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingResort, setEditingResort] = useState(false);
    const [selectedResort, setSelectedResort] = useState<ResortSummary | null>(() =>
        day.resort_id
            ? {
                resort_id: day.resort_id,
                name: day.resort_name || day.resort_id,
                region: day.region || '',
                country_code: 'JP',
              }
            : null
    );

    useEffect(() => {
        if (day.resort_id) {
            setSelectedResort({
                resort_id: day.resort_id,
                name: day.resort_name || day.resort_id,
                region: day.region || '',
                country_code: 'JP',
            });
        } else {
            setSelectedResort(null);
        }
    }, [day.resort_id, day.resort_name, day.region]);

    const handleAdd = async (data: Partial<ItemData>) => {
        await onItemAdd(day.id, data);
        setIsAdding(false);
    };

    const handleResortSelect = async (option: ResortSummary | null) => {
        setSelectedResort(option);
        setEditingResort(false);
        await onDayUpdate(day.id, {
            resort_id: option?.resort_id ?? null,
            resort_name: option?.name ?? null,
            region: option?.region ?? null,
        });
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
                    {day.resort_name && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            🏔️ {day.resort_name}
                        </span>
                    )}
                    {day.is_ski_day && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ⛷️ 滑雪日
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{day.items.length} 個項目</span>
                    <span
                        role="button"
                        tabIndex={0}
                        className="text-blue-600 hover:underline focus:outline-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingResort((prev) => !prev);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingResort((prev) => !prev);
                            }
                        }}
                    >
                        {day.resort_id ? '變更雪場' : '指定雪場'}
                    </span>
                </div>
            </button>

            {/* Day Content */}
            {isExpanded && (
                <div className="border-t border-gray-200 p-4">
                    {day.resort_id && (
                        <div className="mb-3 rounded-lg border border-purple-100 bg-purple-50 p-3 text-sm text-purple-900">
                            <p className="font-semibold">
                                {day.resort_name} · {day.region || '未指定區域'}
                            </p>
                            <p className="text-xs text-purple-700">
                                建議提前查看雪場交通＆票價，確保當天滑雪安排順利。
                            </p>
                        </div>
                    )}

                    {editingResort && (
                        <div className="mb-4">
                            <ResortSearchInput
                                value={selectedResort}
                                onSelect={handleResortSelect}
                                placeholder="輸入雪場名稱（例如 Niseko / Naeba）"
                            />
                        </div>
                    )}

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
