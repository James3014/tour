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
        <div className="tour-card overflow-hidden">
            {/* Day Header */}
            <button
                onClick={onToggle}
                className="w-full px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
            >
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className={`transform transition-transform text-emerald-400 shrink-0 ${isExpanded ? 'rotate-90' : ''}`}>
                        ▶
                    </span>

                    {/* 日期 Badge */}
                    {formattedDate && (
                        <div className="tour-badge badge-emerald shrink-0">
                            <span className="tour-badge-inner text-xs sm:text-sm">{formattedDate}</span>
                        </div>
                    )}

                    <h3 className="font-display text-base sm:text-lg text-gradient-velocity tracking-wide">
                        {day.label}
                    </h3>

                    {day.city && (
                        <span className="text-xs sm:text-sm text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700 shrink-0">
                            {day.city}
                        </span>
                    )}

                    {day.resort_name && (
                        <div className="tour-badge badge-purple shrink-0">
                            <span className="tour-badge-inner text-xs sm:text-sm">🏔️ {day.resort_name}</span>
                        </div>
                    )}

                    {day.is_ski_day && (
                        <div className="tour-badge badge-teal shrink-0">
                            <span className="tour-badge-inner text-xs sm:text-sm">⛷️ 滑雪日</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-500 self-start sm:self-auto">
                    <span className="whitespace-nowrap">{day.items.length} 個項目</span>
                    <span
                        role="button"
                        tabIndex={0}
                        className="text-emerald-400 hover:text-emerald-300 focus:outline-none whitespace-nowrap"
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
                <div className="border-t border-emerald-500/20 p-3 sm:p-4 bg-zinc-900/20">
                    {day.resort_id && (
                        <div className="mb-3 sm:mb-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 sm:p-4 text-xs sm:text-sm">
                            <p className="font-bold text-purple-300 mb-1">
                                {day.resort_name} · {day.region || '未指定區域'}
                            </p>
                            <p className="text-purple-400/80 leading-relaxed">
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
                            <p className="text-zinc-500 text-center py-6 sm:py-8 text-sm">尚無行程項目</p>
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
                        <div className="mt-3 sm:mt-4">
                            <ItemEditForm
                                mode="add"
                                onSave={handleAdd}
                                onCancel={() => setIsAdding(false)}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="w-full mt-3 sm:mt-4 py-2 sm:py-3 text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors border border-emerald-500/30 hover:border-emerald-500/50 font-bold"
                        >
                            + 新增項目
                        </button>
                    )}
                </div>
            )}
            <div className="tour-card-stripes"></div>
        </div>
    );
}
