import { ChecklistItem, ChecklistCategory } from '@/lib/types/template';

interface ChecklistSectionProps {
    checklist: ChecklistItem[];
    onToggle: (itemId: string) => void;
}

const CHECKLIST_CATEGORY_LABELS: Record<string, string> = {
    before_booking: '訂購前確認',
    after_booking: '訂購後準備',
    before_departure: '出發前確認',
    other: '其他',
};

export default function ChecklistSection({ checklist, onToggle }: ChecklistSectionProps) {
    if (checklist.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">📋 行前檢查清單</h2>
                <p className="text-gray-400 text-center py-8">
                    此模板沒有預設檢查清單
                </p>
            </div>
        );
    }

    const groupedItems = checklist.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, ChecklistItem[]>);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">📋 行前檢查清單</h2>

            {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-6 last:mb-0">
                    <h3 className="font-bold text-lg mb-3 text-gray-700">
                        {CHECKLIST_CATEGORY_LABELS[category] || category}
                    </h3>
                    <div className="space-y-2">
                        {items.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => onToggle(item.id)}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className={item.completed ? 'line-through text-gray-400' : ''}>
                                    {item.title}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
