import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-gray-800">
          ⛷️ 滑雪旅程規劃
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          用模板快速規劃你的滑雪旅程
        </p>
        <Link
          href="/templates"
          className="inline-block bg-blue-600 text-white text-lg px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          開始規劃 →
        </Link>
        <p className="mt-6 text-sm text-gray-500">
          MVP 版本 ・ TDD 開發 ・ Linus 風格
        </p>
      </div>
    </main>
  );
}
