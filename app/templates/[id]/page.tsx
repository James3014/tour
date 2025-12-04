'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Template } from '@/lib/types/template';
import type { ResortSummary } from '@/lib/types/resort';
import Link from 'next/link';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [resorts, setResorts] = useState<Record<string, ResortSummary>>({});

  useEffect(() => {
    if (!params.id) return;

    fetch('/api/templates')
      .then((res) => res.json())
      .then((templates: Template[]) => {
        const found = templates.find((t) => t.template_id === params.id);
        setTemplate(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (!template) return;
    const ids = Array.from(
      new Set(
        template.day_templates
          .map((d) => d.default_resort_id)
          .filter((id): id is string => Boolean(id))
      )
    );
    if (ids.length === 0) return;

    fetch(`/api/resorts?ids=${ids.join(',')}`)
      .then((res) => res.json())
      .then((data: ResortSummary[]) => {
        const map: Record<string, ResortSummary> = {};
        data.forEach((r) => {
          map[r.resort_id] = r;
        });
        setResorts(map);
      })
      .catch(() => setResorts({}));
  }, [template]);

  if (loading) {
    return (
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
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
        <div className="max-w-3xl mx-auto">
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm sm:text-base"
          >
            <span>←</span>
            <span>返回模板選擇</span>
          </Link>
        </div>

        {/* Template Info Card */}
        <div className="tour-card p-6 sm:p-8 mb-6">
          <div className="relative z-10">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-3 text-gradient-velocity tracking-wide skew-title">
              <span className="unskew inline-block">{template.name}</span>
            </h1>
            <div className="h-1 w-24 sm:w-32 tour-card-stripes mb-4"></div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-zinc-400 mb-6">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">📍</span>
                {template.region}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">👥</span>
                {template.target_group}
              </span>
            </div>

            <p className="text-zinc-300 mb-6 leading-relaxed">{template.description}</p>

            {/* Day Schedule Preview */}
            <div className="mb-6 p-4 bg-zinc-900/50 rounded-lg border border-emerald-500/20">
              <p className="text-xs text-zinc-500 mb-3 font-medium">行程節奏預覽</p>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {template.day_templates.map((day) => (
                  <div
                    key={day.day_index}
                    className="flex flex-col items-center p-2 sm:p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg gap-0.5 hover:border-emerald-500/30 transition-colors"
                  >
                    <div className="text-xl sm:text-2xl leading-none">
                      {day.is_ski_day ? '⛷️' : day.day_index === 1 || day.day_index === template.default_days ? '✈️' : '🏙️'}
                    </div>
                    <div className="text-xs text-zinc-400">D{day.day_index}</div>
                    <div className="text-xs text-zinc-500 text-center mt-0.5 max-w-[60px] line-clamp-2">
                      {day.label.length > 8 ? day.label.substring(0, 8) + '...' : day.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg">
                <p className="text-xs sm:text-sm text-zinc-500">總天數</p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{template.default_days} 天</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-teal-500/10 to-teal-600/5 border border-teal-500/20 rounded-lg">
                <p className="text-xs sm:text-sm text-zinc-500">滑雪天數</p>
                <p className="text-2xl sm:text-3xl font-bold text-teal-400">{template.default_ski_days} 天</p>
              </div>
            </div>

            {/* Resort Overview */}
            {Object.keys(resorts).length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-zinc-200">雪場亮點</h2>
                <div className="grid gap-3">
                  {Object.values(resorts).map((resort) => (
                    <div
                      key={resort.resort_id}
                      className="border border-zinc-800 bg-zinc-900/30 rounded-lg p-4 hover:border-emerald-500/30 hover:bg-zinc-900/50 transition-all"
                    >
                      <p className="font-semibold text-zinc-100">
                        🏔️ {resort.name} · {resort.region}
                      </p>
                      {resort.tagline && (
                        <p className="text-xs sm:text-sm text-zinc-400 mt-1">{resort.tagline}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day Details */}
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-zinc-200">詳細行程</h2>
              <div className="space-y-3">
                {template.day_templates.map((day) => (
                  <div
                    key={day.day_index}
                    className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/20 hover:border-emerald-500/20 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs sm:text-sm font-medium text-zinc-500">Day {day.day_index}</span>
                      <h3 className="font-bold text-zinc-100">{day.label}</h3>
                      {day.is_ski_day && (
                        <span className="ml-auto text-xs sm:text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-full font-bold">
                          ⛷️ 滑雪日
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 text-sm text-zinc-400 mb-3">
                      {day.default_city && (
                        <p className="flex items-center gap-1.5">
                          <span className="text-emerald-400">📍</span>
                          {day.default_city}
                        </p>
                      )}
                      {day.default_resort_id && (
                        <p className="text-teal-400">
                          推薦雪場：{resorts[day.default_resort_id]?.name || day.default_resort_id}
                        </p>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {day.item_templates.map((item, idx) => (
                        <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{item.title_default}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee */}
            <div className="tour-badge badge-emerald mb-6">
              <div className="tour-badge-inner text-sm">
                ✨ <strong>可自由修改：</strong>
                選擇模板後，您可以自由增刪修改每一天的行程，完全不會鎖住您的規劃彈性。
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push(`/templates/${template.template_id}/create`)}
              className="btn-tour-primary w-full text-base sm:text-lg velocity-shine"
            >
              使用此模板建立旅程 →
            </button>
          </div>
          <div className="tour-card-stripes"></div>
        </div>
      </div>
    </main>
  );
}
