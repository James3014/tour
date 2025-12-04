'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Template } from '@/lib/types/template';
import Link from 'next/link';

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
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="tour-card p-6 loading-pulse">
            <p className="text-zinc-400">載入中...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="tour-card p-6">
            <p className="text-red-400">找不到模板</p>
            <Link href="/templates" className="text-emerald-400 hover:text-emerald-300 mt-4 inline-block transition-colors">
              ← 返回模板選擇
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/templates/${template.template_id}`}
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm sm:text-base"
          >
            <span>←</span>
            <span>返回模板詳情</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="tour-card p-6 sm:p-8">
          <div className="relative z-10">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-2 text-gradient-velocity tracking-wide skew-title">
              <span className="unskew inline-block">建立新旅程</span>
            </h1>
            <div className="h-1 w-20 sm:w-24 tour-card-stripes mb-4"></div>

            <p className="text-zinc-400 mb-8 text-sm sm:text-base">
              使用模板：<span className="font-bold text-emerald-400">{template.name}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 旅程名稱 */}
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-zinc-300 mb-2">
                  旅程名稱 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="例如：2025 北海道家庭滑雪之旅"
                />
                <p className="text-xs text-zinc-500 mt-1.5">可以自訂行程名稱或使用模板名稱</p>
              </div>

              {/* 出發日期 */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-bold text-zinc-300 mb-2">
                  出發日期
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all [color-scheme:dark]"
                />
                <p className="text-xs text-zinc-500 mt-1.5">選填，設定後各天會自動顯示日期</p>
              </div>

              {/* 旅程天數 */}
              <div>
                <label htmlFor="days" className="block text-sm font-bold text-zinc-300 mb-2">
                  旅程天數 <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="days"
                  required
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <p className="text-xs text-zinc-500 mt-1.5">
                  模板預設 <span className="text-emerald-400 font-bold">{template.default_days}</span> 天，可以自訂天數
                </p>
              </div>

              {/* 預計同行人數 */}
              <div>
                <label htmlFor="peopleCount" className="block text-sm font-bold text-zinc-300 mb-2">
                  預計同行人數
                </label>
                <input
                  type="number"
                  id="peopleCount"
                  min="1"
                  max="100"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  placeholder="例如：4"
                />
                <p className="text-xs text-zinc-500 mt-1.5">選填，方便規劃訂房與交通</p>
              </div>

              {/* 簡短備註 */}
              <div>
                <label htmlFor="note" className="block text-sm font-bold text-zinc-300 mb-2">
                  簡短備註
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                  placeholder="例如：家庭旅遊，需要注意小孩保暖"
                />
                <p className="text-xs text-zinc-500 mt-1.5">選填，最多 500 字</p>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-tour-primary velocity-shine disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? '建立中...' : '建立旅程 →'}
                </button>
              </div>
            </form>
          </div>
          <div className="tour-card-stripes"></div>
        </div>
      </div>
    </main>
  );
}
