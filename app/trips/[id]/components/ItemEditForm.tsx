import { useState } from 'react';
import { ItemData, ItemType, TimeHint } from '@/lib/types/template';
import { ItemFormSchema, ItemFormValues } from './schemas';
import { z } from 'zod';

interface ItemEditFormProps {
    initialData?: Partial<ItemData>;
    onSave: (data: Partial<ItemData>) => Promise<void>;
    onCancel: () => void;
    mode: 'edit' | 'add';
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

export default function ItemEditForm({ initialData = {}, onSave, onCancel, mode }: ItemEditFormProps) {
    const [formData, setFormData] = useState<Partial<ItemData>>({
        type: 'other',
        ...initialData,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const validate = () => {
        try {
            // 預處理：將空字串轉為 null 或 undefined 以符合 schema
            const dataToValidate = {
                ...formData,
                link: formData.link === '' ? null : formData.link,
            };

            ItemFormSchema.parse(dataToValidate);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setSaving(true);
        try {
            await onSave(formData);
        } catch (error) {
            console.error(error);
            // 這裡可以顯示一個通用的錯誤訊息，但通常由父組件處理
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof ItemData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // 清除該欄位的錯誤
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <div className={`border rounded-lg p-4 ${mode === 'edit' ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50'}`}>
            <h4 className="font-bold mb-3">{mode === 'edit' ? '編輯項目' : '新增項目'}</h4>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            類型
                        </label>
                        <select
                            value={formData.type || 'other'}
                            onChange={(e) => handleChange('type', e.target.value as ItemType)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            {Object.entries(ITEM_TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            時段
                        </label>
                        <select
                            value={formData.time_hint || ''}
                            onChange={(e) => handleChange('time_hint', (e.target.value || null) as TimeHint | null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">不指定</option>
                            {Object.entries(TIME_HINT_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        標題 *
                    </label>
                    <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder={mode === 'add' ? "例如：去程航班" : ""}
                        autoFocus={mode === 'add'}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            具體時間
                        </label>
                        <input
                            type="time"
                            value={formData.time || ''}
                            onChange={(e) => handleChange('time', e.target.value || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            地點
                        </label>
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => handleChange('location', e.target.value || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="例如：新千歲機場"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        相關連結
                    </label>
                    <input
                        type="text"
                        value={formData.link || ''}
                        onChange={(e) => handleChange('link', e.target.value || null)}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.link ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="例如：訂單連結、Google Maps"
                    />
                    {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        備註
                    </label>
                    <textarea
                        value={formData.note || ''}
                        onChange={(e) => handleChange('note', e.target.value || null)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="其他需要記錄的資訊"
                    />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                    <button
                        onClick={onCancel}
                        disabled={saving}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${mode === 'edit' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {saving ? (mode === 'edit' ? '儲存中...' : '新增中...') : (mode === 'edit' ? '儲存' : '新增')}
                    </button>
                </div>
            </div>
        </div>
    );
}
