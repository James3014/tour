import Link from 'next/link';
import { db } from '@/lib/db';

export default async function TripsPage() {
  // 預設顯示最新 20 筆
  const trips = await db.getAllTrips({ limit: 20 });

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-4 text-sm sm:text-base"
          >
            <span>←</span>
            <span>返回首頁</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3 text-gradient-velocity tracking-wide skew-title">
                <span className="unskew inline-block">我的行程</span>
              </h1>
              <div className="h-1 w-24 sm:w-32 tour-card-stripes"></div>
            </div>
            <Link
              href="/templates"
              className="btn-tour-primary velocity-shine text-sm sm:text-base whitespace-nowrap self-start sm:self-auto"
            >
              + 新增行程
            </Link>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="tour-card p-8 sm:p-12 text-center">
            <div className="text-4xl sm:text-5xl mb-4">🗺️</div>
            <p className="text-zinc-400 text-base sm:text-lg mb-6">還沒有任何行程</p>
            <Link
              href="/templates"
              className="btn-tour-primary velocity-shine inline-block text-sm sm:text-base"
            >
              從模板開始規劃 →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="tour-card p-4 sm:p-6 hover:tour-card-animate group relative"
              >
                <div className="relative z-10">
                  <h2 className="font-display text-2xl sm:text-3xl mb-2 sm:mb-3 text-gradient-velocity tracking-wide skew-title">
                    <span className="unskew inline-block">{trip.title}</span>
                  </h2>

                  <div className="flex flex-wrap gap-3 sm:gap-4 mb-3 text-sm sm:text-base">
                    {trip.start_date && (
                      <div className="tour-badge badge-emerald">
                        <span className="tour-badge-inner">📅 {new Date(trip.start_date).toLocaleDateString('zh-TW')}</span>
                      </div>
                    )}
                    {trip.people_count && (
                      <div className="tour-badge badge-purple">
                        <span className="tour-badge-inner">👥 {trip.people_count} 人</span>
                      </div>
                    )}
                    <div className="tour-badge badge-teal">
                      <span className="tour-badge-inner">📝 {trip.days.length} 天</span>
                    </div>
                  </div>

                  {trip.note && (
                    <p className="text-zinc-400 text-sm sm:text-base line-clamp-2 leading-relaxed">{trip.note}</p>
                  )}

                  <div className="mt-3 sm:mt-4 flex items-center text-emerald-400 text-xs sm:text-sm group-hover:translate-x-1 transition-transform">
                    <span>查看詳情</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
                <div className="tour-card-stripes"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
