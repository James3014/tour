import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Logo Icon */}
      <div className="absolute top-6 left-4 sm:top-8 sm:left-8 flex items-center gap-2">
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center clip-corner">
          🗺️
        </div>
        <div className="hidden sm:block">
          <h2 className="font-display text-lg text-gradient-velocity tracking-wide">
            TOUR PLANNER
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto relative z-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl mb-3 sm:mb-4 text-gradient-velocity tracking-wide skew-title">
            <span className="unskew inline-block">滑雪旅程規劃</span>
          </h1>
          <div className="h-1 w-32 sm:w-48 mx-auto tour-card-stripes"></div>
        </div>

        <p className="text-lg sm:text-xl lg:text-2xl text-zinc-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          用模板快速規劃你的滑雪旅程
          <br />
          <span className="text-emerald-400 text-base sm:text-lg">從選擇到出發，一站搞定</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12 px-4">
          <Link
            href="/templates"
            className="btn-tour-primary velocity-shine text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
          >
            開始規劃 →
          </Link>
          <Link
            href="/trips"
            className="relative group overflow-hidden px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg border-2 border-emerald-500/40 bg-zinc-900 hover:bg-zinc-800 transition-all w-full sm:w-auto clip-corner"
          >
            <span className="relative z-10">我的行程</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12 px-4">
          <div className="tour-badge badge-emerald">
            <span className="tour-badge-inner">📋 模板系統</span>
          </div>
          <div className="tour-badge badge-purple">
            <span className="tour-badge-inner">🎯 智慧推薦</span>
          </div>
          <div className="tour-badge badge-teal">
            <span className="tour-badge-inner">📱 行動優先</span>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="text-xs sm:text-sm text-zinc-600 space-x-2">
          <span>MVP 版本</span>
          <span className="text-zinc-700">・</span>
          <span>TDD 開發</span>
          <span className="text-zinc-700">・</span>
          <span>Linus 風格</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
    </main>
  );
}
