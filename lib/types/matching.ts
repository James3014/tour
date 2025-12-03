export interface MatchSummary {
    user_id: string;
    nickname: string;
    skill_level: number;
    self_role: 'buddy' | 'student' | 'coach';
    match_score: number;
}
