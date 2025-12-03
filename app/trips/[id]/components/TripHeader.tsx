import { useEffect, useMemo, useState } from 'react';
import { TripWithDetails } from '@/lib/types/template';
import TripEditForm from './TripEditForm';
import { collectResortIdsFromTrip } from '@/lib/utils/resort';
import type { MatchSummary } from '@/lib/types/matching';

interface TripHeaderProps {
    trip: TripWithDetails;
    onUpdate: (data: Partial<TripWithDetails>) => Promise<void>;
}

export default function TripHeader({ trip, onUpdate }: TripHeaderProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [matchingState, setMatchingState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
    const [recommendations, setRecommendations] = useState<MatchSummary[]>([]);

    const resortIds = useMemo(() => collectResortIdsFromTrip(trip), [trip]);
    const resortKey = resortIds.join('|');
    const regions = useMemo(() => {
        const bucket = new Set<string>();
        trip.days.forEach((day) => {
            if (day.region) bucket.add(day.region);
        });
        return Array.from(bucket);
    }, [trip]);
    const regionKey = useMemo(() => regions.join('|'), [regions]);

    useEffect(() => {
        let cancelled = false;
        if (resortIds.length === 0) {
            setRecommendations([]);
            setMatchingState('idle');
            return;
        }

        async function loadRecommendations() {
            try {
                setMatchingState('loading');
                const response = await fetch('/api/matching/recommendations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: trip.user_id,
                        resort_ids: resortIds,
                        regions,
                    }),
                });

                if (!response.ok) {
                    throw new Error('failed request');
                }
                const data = await response.json();
                if (!cancelled) {
                    setRecommendations((data.matches || []).slice(0, 3));
                    setMatchingState('loaded');
                }
            } catch (error) {
                if (!cancelled) {
                    setMatchingState('error');
                }
            }
        }

        loadRecommendations();

        return () => {
            cancelled = true;
        };
    }, [trip.user_id, resortKey, regionKey]);

    const formatDate = (date: Date | null) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="tour-card p-4 sm:p-6 mb-4 sm:mb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 text-gradient-velocity tracking-wide skew-title">
                        <span className="unskew inline-block">{trip.title}</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        {trip.start_date ? (
                            <div className="tour-badge badge-emerald">
                                <span className="tour-badge-inner">📅 {formatDate(trip.start_date)}</span>
                            </div>
                        ) : (
                            <div className="tour-badge badge-teal opacity-50">
                                <span className="tour-badge-inner">📅 待填寫出發日期</span>
                            </div>
                        )}
                        <div className="tour-badge badge-purple">
                            <span className="tour-badge-inner">
                                🗓️ {trip.days.length} 天 ・ ⛷️ {trip.days.filter((d) => d.is_ski_day).length} 天滑雪
                            </span>
                        </div>
                        {trip.people_count ? (
                            <div className="tour-badge badge-teal">
                                <span className="tour-badge-inner">👥 {trip.people_count} 人</span>
                            </div>
                        ) : (
                            <div className="tour-badge badge-teal opacity-50">
                                <span className="tour-badge-inner">👥 待填寫人數</span>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-bold transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                    ✏️ 編輯資訊
                </button>
            </div>

            {trip.note && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-300 leading-relaxed">
                        📝 <strong>備註：</strong>{trip.note}
                    </p>
                </div>
            )}

            {resortIds.length > 0 && (
                <div className="mt-4 sm:mt-6 border border-purple-500/30 rounded-lg p-3 sm:p-4 bg-purple-500/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <h2 className="text-base sm:text-lg font-bold text-purple-300">🤝 智慧雪伴推薦</h2>
                        <span className="text-xs text-purple-400">
                            {matchingState === 'loading' && 'AI 配對中...'}
                            {matchingState === 'error' && '無法取得推薦'}
                            {matchingState === 'loaded' && recommendations.length === 0 && '暫無推薦'}
                        </span>
                    </div>

                    {matchingState === 'loading' && (
                        <p className="text-xs sm:text-sm text-purple-400">正在根據您的雪場偏好尋找合適雪伴...</p>
                    )}

                    {matchingState !== 'loading' && recommendations.length > 0 && (
                        <div className="space-y-2 sm:space-y-3">
                            {recommendations.map((match) => (
                                <div
                                    key={match.user_id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg bg-zinc-900/50 px-3 sm:px-4 py-2 sm:py-3 border border-purple-500/20"
                                >
                                    <div>
                                        <p className="font-bold text-white text-sm">
                                            {match.nickname} · Lv.{match.skill_level} ({match.self_role === 'buddy' ? '雪友' : match.self_role === 'coach' ? '教練' : '學生'})
                                        </p>
                                        <p className="text-xs text-purple-400">匹配度 {(match.match_score * 100).toFixed(0)}%</p>
                                    </div>
                                    <button
                                        className="text-xs sm:text-sm text-purple-400 border border-purple-500/30 px-3 py-1 rounded hover:bg-purple-500/10 transition-colors font-bold whitespace-nowrap"
                                        onClick={() => alert('邀請功能尚在規劃，敬請期待')}
                                    >
                                        請他加入
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="tour-card-stripes"></div>

            {isEditing && (
                <TripEditForm
                    trip={trip}
                    onSave={onUpdate}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </div>
    );
}
