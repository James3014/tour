'use client';

import { useEffect, useState } from 'react';
import { Template } from '@/lib/types/template';

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
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">載入中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">選擇旅程模板</h1>
        <p className="text-gray-600 mb-2">從預設模板開始規劃你的滑雪旅程</p>
        <p className="text-sm text-blue-600 font-medium mb-8">
          ✨ 選擇後可自由增刪修改每一天，不會鎖住你的行程
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((template) => (
            <div
              key={template.template_id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
              <p className="text-gray-600 mb-4">{template.description}</p>

              {/* 日程預覽條 */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">行程節奏</p>
                <div className="flex gap-2 flex-wrap">
                  {template.day_templates.map((day) => (
                    <div
                      key={day.day_index}
                      className="flex flex-col items-center"
                    >
                      <div className="text-lg">
                        {day.is_ski_day ? '⛷️' : day.day_index === 1 || day.day_index === template.default_days ? '✈️' : '🏙️'}
                      </div>
                      <div className="text-xs text-gray-600">
                        D{day.day_index}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="font-semibold w-24">地區：</span>
                  <span>{template.region}</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="font-semibold w-24">總天數：</span>
                  <span>{template.default_days} 天</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="font-semibold w-24">滑雪天數：</span>
                  <span>{template.default_ski_days} 天</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="font-semibold w-24">適合：</span>
                  <span>{template.target_group}</span>
                </div>
              </div>

              <button
                onClick={() => (window.location.href = `/templates/${template.template_id}`)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                查看詳情 →
              </button>
            </div>
          ))}

          {/* 從空白開始 */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <h2 className="text-2xl font-bold mb-2">從空白開始</h2>
            <p className="text-gray-600 mb-4">
              已經很熟悉行程規劃？自己從頭開始打造專屬旅程
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-700">
                <span className="font-semibold w-24">彈性：</span>
                <span>完全自訂</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="font-semibold w-24">適合：</span>
                <span>進階玩家、特殊需求</span>
              </div>
            </div>

            <button
              onClick={() => alert('空白旅程功能即將推出！')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              建立空白旅程（即將推出）
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
