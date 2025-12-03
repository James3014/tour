import { PackingItem } from '@/lib/types/template';

interface PackingSectionProps {
    packing: PackingItem[];
    onToggle: (itemId: string) => void;
    suggestions?: string[];
}

const PACKING_CATEGORY_LABELS: Record<string, string> = {
    clothing: '🧥 服裝防寒',
    documents: '📄 證件金流',
    medicine: '💊 藥品',
    ski_gear: '⛷️ 雪具護具',
    other: '📦 其他',
};

export default function PackingSection({ packing, onToggle, suggestions = [] }: PackingSectionProps) {
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
            {suggestions.length > 0 && (
                <div className="mb-5 rounded-lg border border-green-100 bg-green-50 p-4 text-sm text-green-900">
                    <p className="font-semibold mb-2">依雪場推薦的打包重點</p>
                    <ul className="list-disc pl-5 space-y-1 text-green-800">
                        {suggestions.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

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
