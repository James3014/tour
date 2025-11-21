import { useState } from 'react';
import { TripWithDetails } from '@/lib/types/template';

interface TripEditFormProps {
    trip: TripWithDetails;
    onSave: (data: Partial<TripWithDetails>) => Promise<void>;
    onCancel: () => void;
}

export default function TripEditForm({ trip, onSave, onCancel }: TripEditFormProps) {
    const [formData, setFormData] = useState({
        title: trip.title,
        start_date: trip.start_date ? new Date(trip.start_date).toISOString().split('T')[0] : '',
        people_count: trip.people_count?.toString() || '',
        note: trip.note || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({
                title: formData.title,
                start_date: formData.start_date ? new Date(formData.start_date) : null,
                people_count: formData.people_count ? parseInt(formData.people_count) : null,
                note: formData.note || null,
            });
            onCancel();
        } catch (error) {
            console.error(error);
            alert('儲存失敗，請稍後再試');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold">編輯旅程資訊</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            旅程名稱 *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            出發日期
                        </label>
                        <input
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            預計同行人數
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={formData.people_count}
                            onChange={(e) => setFormData({ ...formData, people_count: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            備註
                        </label>
                        <textarea
                            rows={3}
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            disabled={saving}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            disabled={saving}
                        >
                            {saving ? '儲存中...' : '儲存變更'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
