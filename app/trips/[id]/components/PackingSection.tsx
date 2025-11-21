import { PackingItem, PackingCategory } from '@/lib/types/template';

interface PackingSectionProps {
    packing: PackingItem[];
    onToggle: (itemId: string) => void;
}

const PACKING_CATEGORY_LABELS: Record<string, string> = {
    clothing: '🧥 服裝防寒',
    documents: '📄 證件金流',
    medicine: '💊 藥品',
    ski_gear: '⛷️ 雪具護具',
    other: '📦 其他',
};

export default function PackingSection({ packing, onToggle }: PackingSectionProps) {
    if (packing.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">🎒 打包清單</h2>
                <p className="text-gray-400 text-center py-8">
                    此模板沒有預設打包清單
                </p>
            </div>
        );
    }

    const groupedItems = packing.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, PackingItem[]>);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">🎒 打包清單</h2>

            {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-6 last:mb-0">
                    <h3 className="font-bold text-lg mb-3 text-gray-700">
                        {PACKING_CATEGORY_LABELS[category] || category}
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
