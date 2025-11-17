'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Template } from '@/lib/types/template';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500">載入中...</p>
        </div>
      </main>
    );
  }

  if (!template) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a href="/templates" className="text-blue-600 hover:underline text-sm">
            ← 返回模板選擇
          </a>
        </div>

        {/* Template Info Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold mb-3">{template.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>📍 {template.region}</span>
            <span>👥 {template.target_group}</span>
          </div>
          <p className="text-gray-700 mb-6">{template.description}</p>

          {/* Day Schedule Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3 font-medium">行程節奏預覽</p>
            <div className="flex gap-3 flex-wrap">
              {template.day_templates.map((day) => (
                <div
                  key={day.day_index}
                  className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="text-2xl mb-1">
                    {day.is_ski_day ? '⛷️' : day.day_index === 1 ? '✈️' : '🏙️'}
                  </div>
                  <div className="text-xs text-gray-500">D{day.day_index}</div>
                  <div className="text-xs text-gray-700 text-center mt-1 max-w-[60px]">
                    {day.label.length > 8 ? day.label.substring(0, 8) + '...' : day.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">總天數</p>
              <p className="text-2xl font-bold text-blue-600">{template.default_days} 天</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">滑雪天數</p>
              <p className="text-2xl font-bold text-green-600">{template.default_ski_days} 天</p>
            </div>
          </div>

          {/* Day Details */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">詳細行程</h2>
            <div className="space-y-3">
              {template.day_templates.map((day) => (
                <div key={day.day_index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">Day {day.day_index}</span>
                    <h3 className="font-bold">{day.label}</h3>
                    {day.is_ski_day && (
                      <span className="ml-auto text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        ⛷️ 滑雪日
                      </span>
                    )}
                  </div>
                  {day.default_city && (
                    <p className="text-sm text-gray-600">📍 {day.default_city}</p>
                  )}
                  <ul className="mt-2 space-y-1">
                    {day.item_templates.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        • {item.title_default}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ✨ <strong>可自由修改：</strong>
              選擇模板後，您可以自由增刪修改每一天的行程，完全不會鎖住您的規劃彈性。
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push(`/templates/${template.template_id}/create`)}
            className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            使用此模板建立旅程 →
          </button>
        </div>
      </div>
    </main>
  );
}
