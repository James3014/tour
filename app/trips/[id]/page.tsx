'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TripWithDetails } from '@/lib/types/template';

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

export default function TripDetailPage() {
  const params = useParams();
  const [trip, setTrip] = useState<TripWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/trips/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTrip(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-500">載入中...</p>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-500">找不到旅程</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-4xl font-bold mb-2">{trip.title}</h1>
          <p className="text-gray-500">
            {trip.days.length} 天旅程 ・
            {trip.days.filter((d) => d.is_ski_day).length} 天滑雪
          </p>
        </div>

        {/* Days */}
        <div className="space-y-6">
          {trip.days.map((day) => (
            <div key={day.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {day.day_index}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{day.label}</h2>
                  {day.city && (
                    <p className="text-gray-500 text-sm">📍 {day.city}</p>
                  )}
                </div>
                {day.is_ski_day && (
                  <span className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ⛷️ 滑雪日
                  </span>
                )}
              </div>

              {/* Items */}
              <div className="space-y-3">
                {day.items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {ITEM_TYPE_LABELS[item.type]?.split(' ')[0] || '📌'}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          {item.time_hint && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {TIME_HINT_LABELS[item.time_hint] || item.time_hint}
                            </span>
                          )}
                        </div>
                        {item.location && (
                          <p className="text-sm text-gray-600 mb-1">
                            📍 {item.location}
                          </p>
                        )}
                        {item.note && (
                          <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <a
            href="/templates"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            ← 返回模板選擇
          </a>
        </div>
      </div>
    </main>
  );
}
