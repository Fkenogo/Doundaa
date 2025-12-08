import { User, Activity } from '../types';
import { ALL_INTERESTS_MAP } from '../interests';
import { ADJACENT_INTERESTS } from '../interestClusters';

// ============================================
// TYPES & HELPERS
// ============================================

interface SimilarUser {
    user: User;
    similarity: number;
}

export interface RecommendedInterest {
    interestId: string;
    score: number;
    reason: string;
}

export interface RecommendedActivity {
    activity: Activity;
    score: number;
    reason: string;
}

const jaccardSimilarity = <T,>(setA: Set<T>, setB: Set<T>): number => {
    if (setA.size === 0 || setB.size === 0) return 0;
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
}


// ============================================
// SIMILAR USERS FINDER
// ============================================
export const findSimilarUsers = (currentUser: User, allUsers: User[]): SimilarUser[] => {
    const currentUserInterests = new Set(currentUser.interestIds || []);
    if (currentUserInterests.size === 0) return [];
    
    const similarityScores: SimilarUser[] = [];
    
    for (const otherUser of allUsers) {
        if (otherUser.id === currentUser.id) continue;
        
        const otherInterests = new Set(otherUser.interestIds || []);
        const similarity = jaccardSimilarity(currentUserInterests, otherInterests);
        
        if (similarity > 0.3) {
            similarityScores.push({ user: otherUser, similarity });
        }
    }
    
    return similarityScores.sort((a, b) => b.similarity - a.similarity).slice(0, 20);
}


// ============================================
// RECOMMENDATION ENGINE
// ============================================

// FIX: Add 'allActivities' parameter to provide necessary data and remove dependency on a hardcoded constant.
export const generateInterestRecommendations = (currentUser: User, allUsers: User[], allActivities: Activity[]): RecommendedInterest[] => {
    const userInterests = new Set(currentUser.interestIds || []);
    const recommendationScores: { [key: string]: { score: number, reasons: Set<string> } } = {};

    const addScore = (id: string, value: number, reason: string) => {
        if (userInterests.has(id)) return;
        if (!recommendationScores[id]) {
            recommendationScores[id] = { score: 0, reasons: new Set() };
        }
        recommendationScores[id].score += value;
        recommendationScores[id].reasons.add(reason);
    };

    // 1. ADJACENT INTERESTS (40%)
    for (const interestId of userInterests) {
        const adjacentList = ADJACENT_INTERESTS[interestId];
        if (adjacentList) {
            for (const adjacent of adjacentList) {
                const reason = `Because you like ${ALL_INTERESTS_MAP.get(interestId)?.name}`;
                addScore(adjacent.id, adjacent.coOccurrenceRate * 40, reason);
            }
        }
    }

    // 2. BEHAVIORAL PATTERNS (35%)
    const attendedActivities = currentUser.activityHistory?.attended || [];
    for (const { activityId, rating } of attendedActivities) {
        const activity = allActivities.find(a => a.id === activityId);
        if (activity) {
            for (const interestId of activity.interestIds) {
                 const reason = `From an activity you enjoyed`;
                 addScore(interestId, (rating / 5) * 35, reason);
            }
        }
    }

    // 3. COLLABORATIVE FILTERING (25%)
    const similarUsers = findSimilarUsers(currentUser, allUsers);
    for (const { user, similarity } of similarUsers) {
        for (const interestId of (user.interestIds || [])) {
             const reason = `Popular with users like you`;
             addScore(interestId, similarity * 25, reason);
        }
    }

    // RANKING & FILTERING
    const sortedRecommendations: RecommendedInterest[] = Object.entries(recommendationScores)
        .map(([interestId, { score, reasons }]) => ({
            interestId,
            score,
            reason: Array.from(reasons)[0] || 'Recommended for you'
        }))
        .filter(rec => rec.score >= 15)
        .sort((a, b) => b.score - a.score);

    return sortedRecommendations.slice(0, 10);
};


export const generateActivityRecommendations = (currentUser: User, allActivities: Activity[], allUsers: User[]): RecommendedActivity[] => {
    const userInterests = new Set(currentUser.interestIds || []);
    const seenActivities = new Set(currentUser.viewedActivities || []);
    const unseenActivities = allActivities.filter(a => !seenActivities.has(a.id));
    
    const recommendations: RecommendedActivity[] = [];
    const similarUsers = findSimilarUsers(currentUser, allUsers);

    for (const activity of unseenActivities) {
        let score = 0;
        let reason = "";

        // Interest match
        const activityInterests = new Set(activity.interestIds);
        const matches = new Set([...userInterests].filter(i => activityInterests.has(i)));
        if (matches.size > 0) {
            score += matches.size * 20;
            reason = `Matches your interest in ${ALL_INTERESTS_MAP.get([...matches][0])?.name}`;
        }
        
        // Quality score
        score += activity.provider.rating * 5;

        // Popularity among similar users
        let interestedSimilar = 0;
        // This is a mock; in a real app, we'd query which users are interested in which activity.
        if (similarUsers.length > 0 && Math.random() > 0.5) {
            interestedSimilar = Math.floor(Math.random() * (similarUsers.length / 2));
            score += interestedSimilar * 3;
            if(!reason) reason = "Popular with users like you";
        }
        
        if (score > 10) { // Threshold to be recommended
            recommendations.push({
                activity,
                score,
                reason: reason || `A highly-rated doundaa`
            });
        }
    }

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 20);
};