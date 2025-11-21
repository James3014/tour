import { useState } from 'react';
import { TripWithDetails } from '@/lib/types/template';
import TripEditForm from './TripEditForm';

interface TripHeaderProps {
    trip: TripWithDetails;
    onUpdate: (data: Partial<TripWithDetails>) => Promise<void>;
}

export default function TripHeader({ trip, onUpdate }: TripHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);

    const formatDate = (date: Date | null) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        {trip.start_date ? (
                            <span>📅 {formatDate(trip.start_date)}</span>
                        ) : (
                            <span className="text-gray-400">📅 待填寫出發日期</span>
                        )}
                        <span>
                            {trip.days.length} 天旅程 ・
                            {trip.days.filter((d) => d.is_ski_day).length} 天滑雪
                        </span>
                        {trip.people_count ? (
                            <span>👥 {trip.people_count} 人</span>
                        ) : (
                            <span className="text-gray-400">👥 待填寫人數</span>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    編輯資訊
                </button>
            </div>

            {trip.note && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        📝 <strong>備註：</strong>{trip.note}
                    </p>
                </div>
            )}

            {isEditing && (
                <TripEditForm
                    trip={trip}
                    onSave={onUpdate}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </div>
    );
}
