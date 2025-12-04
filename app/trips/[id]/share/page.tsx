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
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="tour-card p-6 loading-pulse">
            <p className="text-zinc-400">載入中...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="tour-card p-6">
            <p className="text-red-400">找不到旅程</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Read-only Banner */}
        <div className="tour-badge badge-teal mb-6">
          <div className="tour-badge-inner text-center">
            👀 <strong>唯讀模式</strong> - 這是由團主分享的旅程資訊，您無法進行編輯
          </div>
        </div>

        {/* Header */}
        <div className="tour-card p-6 sm:p-8 mb-6">
          <div className="relative z-10">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-3 text-gradient-velocity tracking-wide skew-title">
              <span className="unskew inline-block">{trip.title}</span>
            </h1>
            <div className="h-1 w-24 sm:w-32 tour-card-stripes mb-4"></div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-zinc-400">
              {trip.start_date && (
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">📅</span>
                  {formatDate(trip.start_date)}
                </span>
              )}
              <span className="text-zinc-600">•</span>
              <span>
                {trip.days.length} 天旅程 ・
                {trip.days.filter((d) => d.is_ski_day).length} 天滑雪
              </span>
              {trip.people_count && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-400">👥</span>
                    {trip.people_count} 人
                  </span>
                </>
              )}
            </div>

            {trip.note && (
              <div className="mt-4 p-4 bg-zinc-900/50 border border-emerald-500/20 rounded-lg">
                <p className="text-sm text-zinc-300">
                  <span className="text-emerald-400">📝 備註：</span>{trip.note}
                </p>
              </div>
            )}
          </div>
          <div className="tour-card-stripes"></div>
        </div>

        {/* Tabs */}
        <div className="tour-card p-0 mb-6 overflow-hidden">
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex-1 px-6 py-4 font-bold transition-all relative ${
                activeTab === 'itinerary'
                  ? 'text-emerald-400 bg-zinc-900/50'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
              }`}
            >
              {activeTab === 'itinerary' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              )}
              📍 行程
            </button>
            <button
              onClick={() => setActiveTab('preparation')}
              className={`flex-1 px-6 py-4 font-bold transition-all relative ${
                activeTab === 'preparation'
                  ? 'text-emerald-400 bg-zinc-900/50'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
              }`}
            >
              {activeTab === 'preparation' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              )}
              ✅ 行前準備
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'itinerary' ? (
          /* Itinerary Tab */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="text-xs sm:text-sm text-zinc-500">
                💡 提示：可以同時展開多個 Day，方便對照不同天的行程
              </p>
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => {
                    const allExpanded: Record<string, boolean> = {};
                    trip.days.forEach((day) => {
                      allExpanded[day.id] = true;
                    });
                    setExpandedDays(allExpanded);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  展開全部
                </button>
                <span className="text-zinc-700">|</span>
                <button
                  onClick={() => setExpandedDays({})}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  收合全部
                </button>
              </div>
            </div>

            {trip.days.map((day) => (
              <div key={day.id} className="tour-card overflow-hidden">
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(day.id)}
                  className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-zinc-900/30 transition-colors group"
                >
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                    {day.day_index}
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                      {day.label}
                    </h2>
                    {day.city && (
                      <p className="text-zinc-500 text-sm mt-1">
                        <span className="text-emerald-400">📍</span> {day.city}
                      </p>
                    )}
                  </div>
                  {day.is_ski_day && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold">
                      ⛷️ 滑雪日
                    </span>
                  )}
                  <span className="text-zinc-600 text-2xl font-bold group-hover:text-emerald-400 transition-colors">
                    {expandedDays[day.id] ? '−' : '+'}
                  </span>
                </button>

                {/* Day Content */}
                {expandedDays[day.id] && (
                  <div className="border-t border-zinc-800 p-4 sm:p-5 bg-zinc-900/20">
                    <div className="space-y-3">
                      {day.items.length === 0 ? (
                        <p className="text-zinc-600 text-center py-8">尚無行程項目</p>
                      ) : (
                        day.items.map((item) => (
                          <div
                            key={item.id}
                            className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-emerald-500/20 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl flex-shrink-0">
                                {ITEM_TYPE_LABELS[item.type]?.split(' ')[0] || '📌'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-bold text-zinc-100">{item.title}</h3>
                                  {item.time && (
                                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded">
                                      🕐 {item.time}
                                    </span>
                                  )}
                                  {item.time_hint && !item.time && (
                                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                                      {TIME_HINT_LABELS[item.time_hint]}
                                    </span>
                                  )}
                                </div>
                                {item.location && (
                                  <p className="text-sm text-zinc-400 mb-2">
                                    <span className="text-emerald-400">📍</span> {item.location}
                                  </p>
                                )}
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 mb-2 transition-colors"
                                  >
                                    🔗 相關連結
                                  </a>
                                )}
                                {item.note && (
                                  <p className="text-sm text-zinc-400 mt-2 p-3 bg-zinc-950/50 border border-zinc-800 rounded leading-relaxed">
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
            <div className="tour-card p-6 sm:p-8">
              <div className="relative z-10">
                <h2 className="font-display text-3xl sm:text-4xl mb-6 text-gradient-velocity tracking-wide skew-title">
                  <span className="unskew inline-block">📋 行前檢查清單</span>
                </h2>

                {checklist.length === 0 ? (
                  <p className="text-zinc-600 text-center py-12">
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
                    <div key={category} className="mb-8 last:mb-0">
                      <h3 className="font-bold text-lg sm:text-xl mb-4 text-emerald-400 flex items-center gap-2">
                        <span className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></span>
                        {CHECKLIST_CATEGORY_LABELS[category] || category}
                        <span className="h-px flex-1 bg-gradient-to-l from-emerald-500/50 to-transparent"></span>
                      </h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg hover:bg-zinc-900/50 hover:border-emerald-500/20 transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              readOnly
                              disabled
                              className="w-5 h-5 text-emerald-500 bg-zinc-800 border-zinc-700 rounded focus:ring-emerald-500 focus:ring-offset-zinc-900"
                            />
                            <span className={item.completed ? 'line-through text-zinc-600' : 'text-zinc-300'}>
                              {item.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="tour-card-stripes"></div>
            </div>

            {/* Packing Section */}
            <div className="tour-card p-6 sm:p-8">
              <div className="relative z-10">
                <h2 className="font-display text-3xl sm:text-4xl mb-6 text-gradient-velocity tracking-wide skew-title">
                  <span className="unskew inline-block">🎒 打包清單</span>
                </h2>

                {packing.length === 0 ? (
                  <p className="text-zinc-600 text-center py-12">
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
                    <div key={category} className="mb-8 last:mb-0">
                      <h3 className="font-bold text-lg sm:text-xl mb-4 text-teal-400 flex items-center gap-2">
                        <span className="h-px flex-1 bg-gradient-to-r from-teal-500/50 to-transparent"></span>
                        {PACKING_CATEGORY_LABELS[category] || category}
                        <span className="h-px flex-1 bg-gradient-to-l from-teal-500/50 to-transparent"></span>
                      </h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 sm:p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg hover:bg-zinc-900/50 hover:border-teal-500/20 transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              readOnly
                              disabled
                              className="w-5 h-5 text-teal-500 bg-zinc-800 border-zinc-700 rounded focus:ring-teal-500 focus:ring-offset-zinc-900"
                            />
                            <span className={item.completed ? 'line-through text-zinc-600' : 'text-zinc-300'}>
                              {item.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="tour-card-stripes"></div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 mb-4">
            想要編輯自己的旅程？
          </p>
          <a
            href="/templates"
            className="btn-tour-primary inline-flex items-center gap-2 velocity-shine"
          >
            建立我的滑雪旅程 →
          </a>
        </div>
      </div>
    </main>
  );
}
