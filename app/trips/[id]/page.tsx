'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TripWithDetails, ChecklistItem, PackingItem, ItemData, ItemType, TimeHint } from '@/lib/types/template';

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

export default function TripDetailPage() {
  const params = useParams();
  const [trip, setTrip] = useState<TripWithDetails | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [packing, setPacking] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  // Item editing state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ItemData>>({});
  const [saving, setSaving] = useState(false);

  // Item adding state
  const [addingToDayId, setAddingToDayId] = useState<string | null>(null);
  const [addForm, setAddForm] = useState<Partial<ItemData>>({});

  // Share state
  const [copied, setCopied] = useState(false);

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

  const startEditingItem = (item: ItemData) => {
    setEditingItemId(item.id);
    setEditForm({
      type: item.type,
      title: item.title,
      date: item.date,
      time: item.time,
      time_hint: item.time_hint,
      location: item.location,
      link: item.link,
      note: item.note,
    });
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditForm({});
  };

  const saveItem = async () => {
    if (!editingItemId) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/trips/items/${editingItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          date: editForm.date || null,
          time: editForm.time || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update item');

      // Refresh trip data
      const updatedTrip = await fetch(`/api/trips/${params.id}`).then((res) => res.json());
      setTrip(updatedTrip);
      cancelEditing();
    } catch (error) {
      alert('儲存失敗，請稍後再試');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('確定要刪除此項目嗎？')) return;

    try {
      const response = await fetch(`/api/trips/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      // Refresh trip data
      const updatedTrip = await fetch(`/api/trips/${params.id}`).then((res) => res.json());
      setTrip(updatedTrip);
    } catch (error) {
      alert('刪除失敗，請稍後再試');
    }
  };

  const startAddingItem = (dayId: string) => {
    setAddingToDayId(dayId);
    setAddForm({
      type: 'other',
      title: '',
      time_hint: null,
    });
  };

  const cancelAdding = () => {
    setAddingToDayId(null);
    setAddForm({});
  };

  const saveNewItem = async (dayId: string) => {
    if (!addForm.title) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/trips/days/${dayId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addForm,
          date: addForm.date || null,
          time: addForm.time || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to create item');

      // Refresh trip data
      const updatedTrip = await fetch(`/api/trips/${params.id}`).then((res) => res.json());
      setTrip(updatedTrip);
      cancelAdding();
    } catch (error) {
      alert('新增失敗，請稍後再試');
    } finally {
      setSaving(false);
    }
  };

  const toggleChecklistItemHandler = async (itemId: string) => {
    try {
      const response = await fetch(`/api/trips/checklist/${itemId}`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to toggle checklist item');

      // Refresh checklist data
      const updatedChecklist = await fetch(`/api/trips/${params.id}/checklist`).then((res) => res.json());
      setChecklist(updatedChecklist);
    } catch (error) {
      alert('更新失敗，請稍後再試');
    }
  };

  const togglePackingItemHandler = async (itemId: string) => {
    try {
      const response = await fetch(`/api/trips/packing/${itemId}`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to toggle packing item');

      // Refresh packing data
      const updatedPacking = await fetch(`/api/trips/${params.id}/packing`).then((res) => res.json());
      setPacking(updatedPacking);
    } catch (error) {
      alert('更新失敗，請稍後再試');
    }
  };

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/trips/${params.id}/share`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert('複製失敗，請手動複製連結');
    }
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
        {/* Header */}
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
                          <div key={item.id}>
                            {editingItemId === item.id ? (
                              /* Edit Mode */
                              <div className="border border-blue-500 rounded-lg p-4 bg-blue-50">
                                <h4 className="font-bold mb-3">編輯項目</h4>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        類型
                                      </label>
                                      <select
                                        value={editForm.type || ''}
                                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value as ItemType })}
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
                                        value={editForm.time_hint || ''}
                                        onChange={(e) => setEditForm({ ...editForm, time_hint: (e.target.value || null) as TimeHint | null })}
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
                                      value={editForm.title || ''}
                                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        具體時間
                                      </label>
                                      <input
                                        type="time"
                                        value={editForm.time || ''}
                                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value || null })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        地點
                                      </label>
                                      <input
                                        type="text"
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value || null })}
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
                                      value={editForm.link || ''}
                                      onChange={(e) => setEditForm({ ...editForm, link: e.target.value || null })}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                      placeholder="例如：訂單連結、Google Maps"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      備註
                                    </label>
                                    <textarea
                                      value={editForm.note || ''}
                                      onChange={(e) => setEditForm({ ...editForm, note: e.target.value || null })}
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                      placeholder="其他需要記錄的資訊"
                                    />
                                  </div>

                                  <div className="flex gap-2 justify-end pt-2">
                                    <button
                                      onClick={cancelEditing}
                                      disabled={saving}
                                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                                    >
                                      取消
                                    </button>
                                    <button
                                      onClick={saveItem}
                                      disabled={saving || !editForm.title}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                      {saving ? '儲存中...' : '儲存'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* View Mode */
                              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group">
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
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        🔗 相關連結
                                      </a>
                                    )}
                                    {item.note && (
                                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                                        {item.note}
                                      </p>
                                    )}
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                      onClick={() => startEditingItem(item)}
                                      className="text-sm text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
                                    >
                                      編輯
                                    </button>
                                    <button
                                      onClick={() => deleteItem(item.id)}
                                      className="text-sm text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                                    >
                                      刪除
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Item Form */}
                    {addingToDayId === day.id && (
                      <div className="mt-3 border border-green-500 rounded-lg p-4 bg-green-50">
                        <h4 className="font-bold mb-3">新增項目</h4>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                類型
                              </label>
                              <select
                                value={addForm.type || 'other'}
                                onChange={(e) => setAddForm({ ...addForm, type: e.target.value as ItemType })}
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
                                value={addForm.time_hint || ''}
                                onChange={(e) => setAddForm({ ...addForm, time_hint: (e.target.value || null) as TimeHint | null })}
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
                              value={addForm.title || ''}
                              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="例如：去程航班"
                              required
                              autoFocus
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                具體時間
                              </label>
                              <input
                                type="time"
                                value={addForm.time || ''}
                                onChange={(e) => setAddForm({ ...addForm, time: e.target.value || null })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                地點
                              </label>
                              <input
                                type="text"
                                value={addForm.location || ''}
                                onChange={(e) => setAddForm({ ...addForm, location: e.target.value || null })}
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
                              value={addForm.link || ''}
                              onChange={(e) => setAddForm({ ...addForm, link: e.target.value || null })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="例如：訂單連結、Google Maps"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              備註
                            </label>
                            <textarea
                              value={addForm.note || ''}
                              onChange={(e) => setAddForm({ ...addForm, note: e.target.value || null })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="其他需要記錄的資訊"
                            />
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              onClick={cancelAdding}
                              disabled={saving}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                              取消
                            </button>
                            <button
                              onClick={() => saveNewItem(day.id)}
                              disabled={saving || !addForm.title}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              {saving ? '新增中...' : '新增'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => startAddingItem(day.id)}
                      disabled={addingToDayId === day.id}
                      className="w-full mt-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      + 新增項目
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Preparation Tab - Same as before */
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
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItemHandler(item.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className={item.completed ? 'line-through text-gray-400' : ''}>
                            {item.title}
                          </span>
                        </label>
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
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => togglePackingItemHandler(item.id)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className={item.completed ? 'line-through text-gray-400' : ''}>
                            {item.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/templates"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            ← 返回模板選擇
          </a>
          <button
            onClick={copyShareLink}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✓ 已複製連結' : '🔗 分享旅程'}
          </button>
        </div>
      </div>
    </main>
  );
}
