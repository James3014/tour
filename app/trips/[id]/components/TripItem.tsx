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
