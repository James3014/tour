'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTrip } from './hooks/useTrip';
import TripHeader from './components/TripHeader';
import DayItem from './components/DayItem';
import ChecklistSection from './components/ChecklistSection';
import PackingSection from './components/PackingSection';

type TabType = 'itinerary' | 'preparation';

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.id as string;

  const { trip, checklist, packing, loading, error, actions } = useTrip(tripId);

  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  // Auto-expand first 2 days when trip loads
  useEffect(() => {
    if (trip?.days && trip.days.length > 0 && Object.keys(expandedDays).length === 0) {
      const initialExpanded: Record<string, boolean> = {};
      trip.days.slice(0, 2).forEach((day) => {
        initialExpanded[day.id] = true;
      });
      setExpandedDays(initialExpanded);
    }
  }, [trip]); // Only run when trip data is first loaded

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
        <TripHeader trip={trip} />

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
                isExpanded={!!expandedDays[day.id]}
                onToggle={() => toggleDay(day.id)}
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
              onToggle={(id) => handleAction(() => actions.toggleChecklist(id), '更新失敗')}
            />
            <PackingSection
              packing={packing}
              onToggle={(id) => handleAction(() => actions.togglePacking(id), '更新失敗')}
            />
          </div>
        )}
      </div>
    </main>
  );
}
