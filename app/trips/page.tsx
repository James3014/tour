import Link from 'next/link';
import { db } from '@/lib/db';

export default async function TripsPage() {
  const trips = await db.getAllTrips();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">我的行程</h1>
          <Link
            href="/templates"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + 新增行程
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-6">還沒有任何行程</p>
            <Link
              href="/templates"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              從模板開始規劃 →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {trip.title}
                </h2>
                <div className="flex gap-4 text-gray-600">
                  {trip.startDate && (
                    <span>📅 {new Date(trip.startDate).toLocaleDateString('zh-TW')}</span>
                  )}
                  {trip.participants && (
                    <span>👥 {trip.participants} 人</span>
                  )}
                  <span>📝 {trip.days.length} 天</span>
                </div>
                {trip.notes && (
                  <p className="text-gray-500 mt-2 line-clamp-2">{trip.notes}</p>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← 返回首頁
          </Link>
        </div>
      </div>
    </main>
  );
}
