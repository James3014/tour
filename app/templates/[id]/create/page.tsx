'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Template } from '@/lib/types/template';

export default function CreateTripPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [days, setDays] = useState(0);
  const [peopleCount, setPeopleCount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!params.id) return;

    fetch('/api/templates')
      .then((res) => res.json())
      .then((templates: Template[]) => {
        const found = templates.find((t) => t.template_id === params.id);
        if (found) {
          setTemplate(found);
          // Set default values from template
          setTitle(found.name);
          setDays(found.default_days);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: template.template_id,
          user_id: 'demo_user', // TODO: 實際使用者 ID
          title,
          start_date: startDate || null,
          days,
          people_count: peopleCount ? parseInt(peopleCount) : null,
          note: note || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const trip = await response.json();

      // Redirect to trip detail page
      router.push(`/trips/${trip.id}`);
    } catch (error) {
      alert('建立旅程失敗，請稍後再試');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-500">載入中...</p>
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-500">找不到模板</p>
          <a href="/templates" className="text-blue-600 hover:underline mt-4 inline-block">
            ← 返回模板選擇
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a
            href={`/templates/${template.template_id}`}
            className="text-blue-600 hover:underline text-sm"
          >
            ← 返回模板詳情
          </a>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-2">建立新旅程</h1>
          <p className="text-gray-600 mb-6">
            使用模板：<span className="font-medium">{template.name}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 旅程名稱 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                旅程名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：2025 北海道家庭滑雪之旅"
              />
              <p className="text-xs text-gray-500 mt-1">可以自訂行程名稱或使用模板名稱</p>
            </div>

            {/* 出發日期 */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                出發日期
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">選填，可以稍後在行程中修改</p>
            </div>

            {/* 旅程天數 */}
            <div>
              <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                旅程天數 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="days"
                required
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                模板預設 {template.default_days} 天，可以自訂天數
              </p>
            </div>

            {/* 預計同行人數 */}
            <div>
              <label htmlFor="peopleCount" className="block text-sm font-medium text-gray-700 mb-2">
                預計同行人數
              </label>
              <input
                type="number"
                id="peopleCount"
                min="1"
                max="100"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：4"
              />
              <p className="text-xs text-gray-500 mt-1">選填，方便規劃訂房與交通</p>
            </div>

            {/* 簡短備註 */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                簡短備註
              </label>
              <textarea
                id="note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：家庭旅遊，需要注意小孩保暖"
              />
              <p className="text-xs text-gray-500 mt-1">選填，最多 500 字</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={submitting}
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                disabled={submitting}
              >
                {submitting ? '建立中...' : '建立旅程 →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
