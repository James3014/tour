'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTrip } from './hooks/useTrip';
import TripHeader from './components/TripHeader';
import DayItem from './components/DayItem';
import ChecklistSection from './components/ChecklistSection';
import PackingSection from './components/PackingSection';
import type { TripWithDetails } from '@/lib/types/template';

type TabType = 'itinerary' | 'preparation';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;

  const { trip, checklist, packing, loading, error, actions } = useTrip(tripId);

  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const hasInitialized = useRef(false);

  const resortInsights = useMemo(() => buildResortInsights(trip?.days || []), [trip?.days]);

  // Auto-expand first 2 days only on initial load
  useEffect(() => {
    if (trip?.days && !hasInitialized.current) {
      const initialExpanded: Record<string, boolean> = {};
      trip.days.slice(0, 2).forEach((day) => {
        initialExpanded[day.id] = true;
      });
      setExpandedDays(initialExpanded);
      hasInitialized.current = true;
    }
  }, [trip?.days])

  const toggleDay = (dayId: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  const handleAction = async (action: () => Promise<void>, errorMessage: string) => {
    try {
      await action();
    } catch (err) {
      alert(errorMessage);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-red-500">{error || '找不到旅程'}</p>
          <a href="/templates" className="text-blue-600 hover:underline mt-4 inline-block">
            ← 返回模板選擇
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <TripHeader
          trip={trip}
          onUpdate={(data) => handleAction(() => actions.updateTrip(data), '更新失敗')}
        />

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'itinerary'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                📍 行程
              </button>
              <button
                onClick={() => setActiveTab('preparation')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${activeTab === 'preparation'
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
              <DayItem
                key={day.id}
                day={day}
                tripStartDate={trip.start_date ? new Date(trip.start_date) : null}
                isExpanded={!!expandedDays[day.id]}
                onToggle={() => toggleDay(day.id)}
                onDayUpdate={(dayId, data) => handleAction(() => actions.updateDay(dayId, data), '更新雪場失敗')}
                onItemUpdate={(id, data) => handleAction(() => actions.updateItem(id, data), '儲存失敗')}
                onItemDelete={(id) => handleAction(() => actions.deleteItem(id), '刪除失敗')}
                onItemAdd={(dayId, data) => handleAction(() => actions.addItem(dayId, data), '新增失敗')}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <ChecklistSection
              checklist={checklist}
              dynamicTips={resortInsights.checklistTips}
              onToggle={(id) => handleAction(() => actions.toggleChecklist(id), '更新失敗')}
            />
            <PackingSection
              packing={packing}
              suggestions={resortInsights.packingSuggestions}
              onToggle={(id) => handleAction(() => actions.togglePacking(id), '更新失敗')}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function buildResortInsights(days: TripWithDetails['days'] = []) {
  const regions = new Set<string>();
  const names = new Set<string>();

  days.forEach((day) => {
    if (day.region) regions.add(day.region);
    if (day.resort_name) names.add(day.resort_name);
    day.items.forEach((item) => {
      if (item.region) regions.add(item.region);
      if (item.resort_name) names.add(item.resort_name);
    });
  });

  const checklistTips: string[] = [];
  const packingSuggestions: string[] = [];

  const hasHokkaido = Array.from(regions).some((r) => /北海道|Hokkaido/i.test(r));
  const hasNagano = Array.from(regions).some((r) => /長野|Nagano/i.test(r));
  const hasNiigata = Array.from(regions).some((r) => /新潟|Niigata/i.test(r));

  if (hasHokkaido) {
    checklistTips.push('北海道行程：記得預留交通緩衝並提前查看暴風雪公告。');
    packingSuggestions.push('極地保暖層（發熱衣、羽絨外套、面罩）');
  }

  if (hasNagano) {
    checklistTips.push('長野溫泉區：確認住宿是否提供溫泉，帶好泳衣或拖鞋。');
    packingSuggestions.push('溫泉裝備（泳衣/輕便浴衣）與小額現金');
  }

  if (hasNiigata) {
    checklistTips.push('新潟粉雪多，安排備用交通與夜滑場地確認。');
    packingSuggestions.push('護目鏡備用鏡片與防水手套');
  }

  if (names.size > 0) {
    checklistTips.push(`本行程涵蓋雪場：${Array.from(names).join('、')}。請逐一確認票券與租借需求。`);
  }

  return {
    checklistTips,
    packingSuggestions,
  };
}
