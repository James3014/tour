import { useEffect, useState } from 'react';
import { ItemData, ItemType, TimeHint } from '@/lib/types/template';
import { ItemFormSchema, ItemFormValues } from './schemas';
import { z } from 'zod';
import ResortSearchInput from '@/components/ResortSearchInput';
import type { ResortSummary } from '@/lib/types/resort';

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
    const [showMore, setShowMore] = useState(false);
    const [selectedResort, setSelectedResort] = useState<ResortSummary | null>(() =>
        initialData.resort_id
            ? {
                resort_id: initialData.resort_id,
                name: initialData.resort_name || initialData.resort_id,
                region: initialData.region || '',
                country_code: 'JP',
              }
            : null
    );

    useEffect(() => {
        if (initialData.resort_id) {
            setSelectedResort({
                resort_id: initialData.resort_id,
                name: initialData.resort_name || initialData.resort_id,
                region: initialData.region || '',
                country_code: 'JP',
            });
        }
    }, [initialData.resort_id, initialData.resort_name, initialData.region]);

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
            // Normalize empty strings to null at boundary
            const normalized = Object.fromEntries(
                Object.entries(formData).map(([k, v]) => [k, v === '' ? null : v])
            );
            await onSave(normalized);
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof ItemData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const { [field]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleResortSelect = (option: ResortSummary | null) => {
        setSelectedResort(option);
        handleChange('resort_id', option?.resort_id ?? null);
        handleChange('region', option?.region ?? null);
        handleChange('resort_name', option?.name ?? null);
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
                            onChange={(e) => handleChange('time_hint', e.target.value as TimeHint)}
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
                            onChange={(e) => handleChange('time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>

                {!showMore ? (
                    <button
                        onClick={() => setShowMore(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        <span>+ 顯示更多選項 (雪場、地點、連結、備註)</span>
                    </button>
                ) : (
                    <div className="space-y-3 border-t pt-3 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                指定雪場
                            </label>
                            <ResortSearchInput
                                value={selectedResort}
                                onSelect={handleResortSelect}
                                placeholder="輸入雪場名稱或地區"
                            />
                            {selectedResort && (
                                <p className="text-xs text-gray-500 mt-1">
                                    已選：{selectedResort.name}（{selectedResort.region}）
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                地點
                            </label>
                            <input
                                type="text"
                                value={formData.location || ''}
                                onChange={(e) => handleChange('location', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="例如：新千歲機場"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                相關連結
                            </label>
                            <input
                                type="text"
                                value={formData.link || ''}
                                onChange={(e) => handleChange('link', e.target.value)}
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
                                onChange={(e) => handleChange('note', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="其他需要記錄的資訊"
                            />
                        </div>
                    </div>
                )}

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
