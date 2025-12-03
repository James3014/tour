import { useState } from 'react';
import { ItemData, ItemType } from '@/lib/types/template';
import ItemEditForm from './ItemEditForm';
import Image from 'next/image';

// Map item types to icon background images
const ICON_BACKGROUNDS: Record<ItemType, string> = {
  flight: '/images/icons/icon-flight-bg.png',
  hotel: '/images/icons/icon-hotel-bg.png',
  transfer: '/images/icons/icon-transfer-bg.png',
  ski: '/images/icons/icon-ski-bg.png',
  lesson: '/images/icons/icon-lesson-bg.png',
  todo: '/images/icons/icon-todo-bg.png',
  note: '/images/icons/icon-note-bg.png',
  other: '/images/icons/icon-other-bg.png',
};

interface TripItemProps {
    item: ItemData;
    onUpdate: (itemId: string, data: Partial<ItemData>) => Promise<void>;
    onDelete: (itemId: string) => Promise<void>;
}

const TIME_HINT_LABELS: Record<string, string> = {
    morning: '早上',
    afternoon: '下午',
    evening: '晚上',
    full_day: '全天',
};

const ITEM_TYPE_LABELS: Record<string, string> = {
    flight: '✈️ 航班',
    hotel: '🏨 住宿',
    transfer: '🚌 交通',
    ski: '⛷️ 滑雪',
    lesson: '📚 課程',
    todo: '✅ 待辦',
    note: '📝 備註',
    other: '📌 其他',
};

export default function TripItem({ item, onUpdate, onDelete }: TripItemProps) {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async (data: Partial<ItemData>) => {
        await onUpdate(item.id, data);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (confirm('確定要刪除此項目嗎？')) {
            await onDelete(item.id);
        }
    };

    if (isEditing) {
        return (
            <ItemEditForm
                mode="edit"
                initialData={item}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    const iconBg = ICON_BACKGROUNDS[item.type] || ICON_BACKGROUNDS.other;

    return (
        <div className="relative bg-zinc-900/50 border border-emerald-500/20 rounded-lg p-3 sm:p-4 hover:bg-zinc-900/70 hover:border-emerald-500/40 transition-all group">
            <div className="flex items-start gap-3">
                {/* Icon with custom background image */}
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl border border-emerald-500/30 relative overflow-hidden">
                    <Image
                        src={iconBg}
                        alt={item.type}
                        fill
                        className="object-cover opacity-40"
                        sizes="48px"
                    />
                    <span className="relative z-10">{ITEM_TYPE_LABELS[item.type]?.split(' ')[0] || '📌'}</span>
                </div>

                <div className="flex-1 min-w-0">
                    {/* Title row with badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-white text-sm sm:text-base">{item.title}</h3>
                        {item.time && (
                            <div className="tour-badge badge-emerald">
                                <span className="tour-badge-inner text-xs">🕐 {item.time}</span>
                            </div>
                        )}
                        {item.time_hint && !item.time && (
                            <div className="tour-badge badge-teal">
                                <span className="tour-badge-inner text-xs">{TIME_HINT_LABELS[item.time_hint]}</span>
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    {item.location && (
                        <p className="text-xs sm:text-sm text-zinc-400 mb-1 flex items-center gap-1">
                            <span>📍</span>
                            <span>{item.location}</span>
                        </p>
                    )}

                    {/* Link */}
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 mb-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>🔗</span>
                            <span>相關連結</span>
                        </a>
                    )}

                    {/* Note */}
                    {item.note && (
                        <p className="text-xs sm:text-sm text-zinc-500 mt-2 bg-zinc-800/50 p-2 rounded border border-zinc-700/50 leading-relaxed">
                            {item.note}
                        </p>
                    )}

                    {/* Resort info */}
                    {item.resort_name && (
                        <div className="mt-2 sm:mt-3 rounded-lg border border-purple-500/30 bg-purple-500/10 p-2 sm:p-3 text-xs">
                            <p className="font-bold text-purple-300">
                                🏔️ {item.resort_name}
                                {item.region ? ` · ${item.region}` : ''}
                            </p>
                            <p className="mt-1 text-purple-400/80 leading-relaxed">
                                {describeResortHighlight(item.region)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 shrink-0">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs sm:text-sm text-emerald-400 hover:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30 hover:border-emerald-500/50 transition-colors"
                    >
                        編輯
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-xs sm:text-sm text-red-400 hover:bg-red-500/10 px-2 py-1 rounded border border-red-500/30 hover:border-red-500/50 transition-colors"
                    >
                        刪除
                    </button>
                </div>
            </div>

            {/* Bottom shine */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        </div>
    );
}

function describeResortHighlight(region?: string | null) {
    if (!region) return '查看雪場交通、票價與租借資訊，避免臨時狀況。';
    if (/北海道|Hokkaido/i.test(region)) {
        return '北海道粉雪：注意防寒，善用巴士接駁並預訂夜滑。';
    }
    if (/長野|Nagano/i.test(region)) {
        return '長野山谷：許多雪場鄰近溫泉小鎮，建議安排泡湯與美食。';
    }
    if (/新潟|Niigata/i.test(region)) {
        return '新潟越後：交通依賴新幹線與巴士，記得預留通勤時間。';
    }
    return '確認雪場營運時段與天氣，提前鎖定交通與票券。';
}
