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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        {trip.start_date ? (
                            <span>📅 {formatDate(trip.start_date)}</span>
                        ) : (
                            <span className="text-gray-400">📅 待填寫出發日期</span>
                        )}
                        <span>
                            {trip.days.length} 天旅程 ・
                            {trip.days.filter((d) => d.is_ski_day).length} 天滑雪
                        </span>
                        {trip.people_count ? (
                            <span>👥 {trip.people_count} 人</span>
                        ) : (
                            <span className="text-gray-400">👥 待填寫人數</span>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                    編輯資訊
                </button>
            </div>

            {trip.note && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        📝 <strong>備註：</strong>{trip.note}
                    </p>
                </div>
            )}

            {resortIds.length > 0 && (
                <div className="mt-6 border border-purple-100 rounded-lg p-4 bg-purple-50">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-purple-900">🤝 智慧雪伴推薦</h2>
                        <span className="text-xs text-purple-600">
                            {matchingState === 'loading' && 'AI 配對中...'}
                            {matchingState === 'error' && '無法取得推薦'}
                            {matchingState === 'loaded' && recommendations.length === 0 && '暫無推薦'}
                        </span>
                    </div>

                    {matchingState === 'loading' && (
                        <p className="text-sm text-purple-700">正在根據您的雪場偏好尋找合適雪伴...</p>
                    )}

                    {matchingState !== 'loading' && recommendations.length > 0 && (
                        <div className="space-y-3">
                            {recommendations.map((match) => (
                                <div
                                    key={match.user_id}
                                    className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm border border-purple-100"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {match.nickname} · Lv.{match.skill_level} ({match.self_role === 'buddy' ? '雪友' : match.self_role === 'coach' ? '教練' : '學生'})
                                        </p>
                                        <p className="text-xs text-gray-500">匹配度 {(match.match_score * 100).toFixed(0)}%</p>
                                    </div>
                                    <button
                                        className="text-sm text-purple-700 border border-purple-200 px-3 py-1 rounded hover:bg-purple-100"
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
