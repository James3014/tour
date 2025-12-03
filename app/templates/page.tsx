'use client';

import { useEffect, useState } from 'react';
import { Template } from '@/lib/types/template';
import Link from 'next/link';
import Image from 'next/image';

// Map template names to image filenames
const TEMPLATE_IMAGES: Record<string, string> = {
  '東北精華 5 日': '/images/templates/template-hokkaido-nagano.jpg',
  '新手友善 4 日': '/images/templates/template-beginner.jpg',
  '深度探索 7 日': '/images/templates/template-advanced.jpg',
  '家庭親子 6 日': '/images/templates/template-family.jpg',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="tour-card p-6 loading-pulse">
            <p className="text-zinc-400">載入中...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-4 text-sm sm:text-base"
          >
            <span>←</span>
            <span>返回首頁</span>
          </Link>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 text-gradient-velocity tracking-wide skew-title">
            <span className="unskew inline-block">選擇旅程模板</span>
          </h1>
          <div className="h-1 w-24 sm:w-32 tour-card-stripes mb-3 sm:mb-4"></div>

          <p className="text-zinc-400 text-base sm:text-lg mb-2">從預設模板開始規劃你的滑雪旅程</p>
          <div className="tour-badge badge-emerald inline-flex">
            <span className="tour-badge-inner">✨ 選擇後可自由增刪修改每一天，不會鎖住你的行程</span>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2">
          {templates.map((template) => {
            const imageUrl = TEMPLATE_IMAGES[template.name] || '/images/templates/template-beginner.jpg';
            return (
              <div
                key={template.template_id}
                className="tour-card p-0 hover:tour-card-animate relative group overflow-hidden"
              >
                {/* Template Image */}
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={template.name}
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>
                </div>

                <div className="relative z-10 p-4 sm:p-6">
                  <h2 className="font-display text-2xl sm:text-3xl mb-2 sm:mb-3 text-gradient-velocity tracking-wide skew-title">
                    <span className="unskew inline-block">{template.name}</span>
                  </h2>
                  <p className="text-zinc-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{template.description}</p>

                {/* 日程預覽條 */}
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-zinc-900/50 rounded-lg border border-emerald-500/20">
                  <p className="text-xs text-zinc-500 mb-2 sm:mb-3">行程節奏</p>
                  <div className="flex gap-2 flex-wrap">
                    {template.day_templates.map((day) => (
                      <div
                        key={day.day_index}
                        className="flex flex-col items-center min-w-[2rem]"
                      >
                        <div className="text-lg sm:text-xl">
                          {day.is_ski_day ? '⛷️' : day.day_index === 1 || day.day_index === template.default_days ? '✈️' : '🏙️'}
                        </div>
                        <div className="text-xs text-zinc-600">
                          D{day.day_index}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mb-4 sm:mb-6">
                  <div className="flex items-start sm:items-center text-xs sm:text-sm">
                    <span className="font-bold text-emerald-400 w-20 sm:w-24 shrink-0">地區：</span>
                    <span className="text-zinc-300">{template.region}</span>
                  </div>
                  <div className="flex items-start sm:items-center text-xs sm:text-sm">
                    <span className="font-bold text-emerald-400 w-20 sm:w-24 shrink-0">總天數：</span>
                    <span className="text-zinc-300">{template.default_days} 天</span>
                  </div>
                  <div className="flex items-start sm:items-center text-xs sm:text-sm">
                    <span className="font-bold text-emerald-400 w-20 sm:w-24 shrink-0">滑雪天數：</span>
                    <span className="text-zinc-300">{template.default_ski_days} 天</span>
                  </div>
                  <div className="flex items-start sm:items-center text-xs sm:text-sm">
                    <span className="font-bold text-emerald-400 w-20 sm:w-24 shrink-0">適合：</span>
                    <span className="text-zinc-300">{template.target_group}</span>
                  </div>
                </div>

                  <button
                    onClick={() => (window.location.href = `/templates/${template.template_id}`)}
                    className="btn-tour-primary w-full text-sm sm:text-base velocity-shine"
                  >
                    查看詳情 →
                  </button>
                </div>
                <div className="tour-card-stripes"></div>
              </div>
            );
          })}

          {/* 從空白開始 */}
          <div className="tour-card p-4 sm:p-6 border-dashed border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all relative group">
            <div className="relative z-10">
              <h2 className="font-display text-2xl sm:text-3xl mb-2 sm:mb-3 text-gradient-velocity tracking-wide skew-title">
                <span className="unskew inline-block">從空白開始</span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                已經很熟悉行程規劃？自己從頭開始打造專屬旅程
              </p>

              <div className="space-y-2 mb-4 sm:mb-6">
                <div className="flex items-start sm:items-center text-xs sm:text-sm">
                  <span className="font-bold text-emerald-400 w-20 sm:w-24 shrink-0">彈性：</span>
                  <span className="text-zinc-300">完全自訂</span>
                </div>
                <div className="flex items-start sm:items-center text-xs sm:text-sm">
                  <span className="font-bold text-emerald-400 w-20 sm:w-24 shrink-0">適合：</span>
                  <span className="text-zinc-300">進階玩家、特殊需求</span>
                </div>
              </div>

              <button
                onClick={() => alert('空白旅程功能即將推出！')}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 px-4 rounded-lg font-bold transition-colors clip-corner text-sm sm:text-base"
              >
                建立空白旅程（即將推出）
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
