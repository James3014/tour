'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Template } from '@/lib/types/template';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateTrip = async (templateId: string) => {
    setCreating(templateId);

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: templateId,
          user_id: 'demo_user', // MVP: 固定用戶
        }),
      });

      if (!res.ok) throw new Error('創建失敗');

      const trip = await res.json();
      router.push(`/trips/${trip.id}`);
    } catch (error) {
      alert('創建旅程失敗');
      setCreating(null);
    }
  };

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
        <p className="text-gray-600 mb-8">從預設模板開始規劃你的滑雪旅程</p>

        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((template) => (
            <div
              key={template.template_id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
              <p className="text-gray-600 mb-4">{template.description}</p>

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
                onClick={() => handleCreateTrip(template.template_id)}
                disabled={creating === template.template_id}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {creating === template.template_id ? '創建中...' : '使用此模板'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
