import { useState } from 'react';
import { ItemData } from '@/lib/types/template';
import ItemEditForm from './ItemEditForm';

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

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group bg-white">
            <div className="flex items-start gap-3">
                <span className="text-2xl">
                    {ITEM_TYPE_LABELS[item.type]?.split(' ')[0] || '📌'}
                </span>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.time && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                🕐 {item.time}
                            </span>
                        )}
                        {item.time_hint && !item.time && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {TIME_HINT_LABELS[item.time_hint]}
                            </span>
                        )}
                    </div>
                    {item.location && (
                        <p className="text-sm text-gray-600 mb-1">
                            📍 {item.location}
                        </p>
                    )}
                    {item.link && (
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline inline-block mb-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            🔗 相關連結
                        </a>
                    )}
                    {item.note && (
                        <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                            {item.note}
                        </p>
                    )}
                    {item.resort_name && (
                        <div className="mt-3 rounded-lg border border-purple-100 bg-purple-50 p-3 text-xs text-purple-900">
                            <p className="font-semibold">
                                🏔️ {item.resort_name}
                                {item.region ? ` · ${item.region}` : ''}
                            </p>
                            <p className="mt-1">
                                {describeResortHighlight(item.region)}
                            </p>
                        </div>
                    )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                    >
                        編輯
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                    >
                        刪除
                    </button>
                </div>
            </div>
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
