import { TripWithDetails } from '@/lib/types/template';

interface TripHeaderProps {
  trip: TripWithDetails;
}

export default function TripHeader({ trip }: TripHeaderProps) {
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
            {trip.start_date && (
              <span>📅 {formatDate(trip.start_date)}</span>
            )}
            <span>
              {trip.days.length} 天旅程 ・
              {trip.days.filter((d) => d.is_ski_day).length} 天滑雪
            </span>
            {trip.people_count && (
              <span>👥 {trip.people_count} 人</span>
            )}
          </div>
        </div>
        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
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
    </div>
  );
}
