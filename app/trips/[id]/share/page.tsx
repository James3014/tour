'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TripWithDetails, ChecklistItem, PackingItem } from '@/lib/types/template';

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

const CHECKLIST_CATEGORY_LABELS: Record<string, string> = {
  before_booking: '訂購前確認',
  after_booking: '訂購後準備',
  before_departure: '出發前確認',
  other: '其他',
};

const PACKING_CATEGORY_LABELS: Record<string, string> = {
  clothing: '🧥 服裝防寒',
  documents: '📄 證件金流',
  medicine: '💊 藥品',
  ski_gear: '⛷️ 雪具護具',
  other: '📦 其他',
};

type TabType = 'itinerary' | 'preparation';

export default function TripSharePage() {
  const params = useParams();
  const [trip, setTrip] = useState<TripWithDetails | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [packing, setPacking] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!params.id) return;

    Promise.all([
      fetch(`/api/trips/${params.id}`).then((res) => res.json()),
      fetch(`/api/trips/${params.id}/checklist`).then((res) => res.ok ? res.json() : []),
      fetch(`/api/trips/${params.id}/packing`).then((res) => res.ok ? res.json() : []),
    ])
      .then(([tripData, checklistData, packingData]) => {
        setTrip(tripData);
        setChecklist(checklistData);
        setPacking(packingData);

        if (tripData.days.length > 0) {
          const initialExpanded: Record<string, boolean> = {};
          tripData.days.slice(0, 2).forEach((day: any) => {
            initialExpanded[day.id] = true;
          });
          setExpandedDays(initialExpanded);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const toggleDay = (dayId: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
        {/* Read-only Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 text-center">
            👀 <strong>唯讀模式</strong> - 這是由團主分享的旅程資訊，您無法進行編輯
          </p>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
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

          {trip.note && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                📝 <strong>備註：</strong>{trip.note}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'itinerary'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📍 行程
              </button>
              <button
                onClick={() => setActiveTab('preparation')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'preparation'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ✅ 行前準備
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'itinerary' ? (
          /* Itinerary Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                💡 提示：可以同時展開多個 Day，方便對照不同天的行程
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const allExpanded: Record<string, boolean> = {};
                    trip.days.forEach((day) => {
                      allExpanded[day.id] = true;
                    });
                    setExpandedDays(allExpanded);
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  展開全部
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => setExpandedDays({})}
                  className="text-sm text-blue-600 hover:underline"
                >
                  收合全部
                </button>
              </div>
            </div>

            {trip.days.map((day) => (
              <div key={day.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(day.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                    {day.day_index}
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-xl font-bold">{day.label}</h2>
                    {day.city && (
                      <p className="text-gray-500 text-sm">📍 {day.city}</p>
                    )}
                  </div>
                  {day.is_ski_day && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ⛷️ 滑雪日
                    </span>
                  )}
                  <span className="text-gray-400 text-2xl">
                    {expandedDays[day.id] ? '−' : '+'}
                  </span>
                </button>

                {/* Day Content */}
                {expandedDays[day.id] && (
                  <div className="border-t border-gray-200 p-4">
                    <div className="space-y-3">
                      {day.items.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">尚無行程項目</p>
                      ) : (
                        day.items.map((item) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
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
                                  >
                                    🔗 相關連結
                                  </a>
                                )}
                                {item.note && (
                                  <p className="text-sm text-gray-500 mt-2 bg-white p-2 rounded">
                                    {item.note}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Preparation Tab */
          <div className="space-y-6">
            {/* Checklist Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">📋 行前檢查清單</h2>

              {checklist.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  此模板沒有預設檢查清單
                </p>
              ) : (
                Object.entries(
                  checklist.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, ChecklistItem[]>)
                ).map(([category, items]) => (
                  <div key={category} className="mb-6 last:mb-0">
                    <h3 className="font-bold text-lg mb-3 text-gray-700">
                      {CHECKLIST_CATEGORY_LABELS[category] || category}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            readOnly
                            disabled
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className={item.completed ? 'line-through text-gray-400' : ''}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Packing Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">🎒 打包清單</h2>

              {packing.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  此模板沒有預設打包清單
                </p>
              ) : (
                Object.entries(
                  packing.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {} as Record<string, PackingItem[]>)
                ).map(([category, items]) => (
                  <div key={category} className="mb-6 last:mb-0">
                    <h3 className="font-bold text-lg mb-3 text-gray-700">
                      {PACKING_CATEGORY_LABELS[category] || category}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            readOnly
                            disabled
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className={item.completed ? 'line-through text-gray-400' : ''}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">
              想要編輯自己的旅程？
            </p>
            <a
              href="/templates"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              建立我的滑雪旅程
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
