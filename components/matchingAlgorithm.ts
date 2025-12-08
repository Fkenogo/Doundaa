import { User } from '../types';
import { ALGORITHM_WEIGHTS } from '../algorithmConfig';

// ============================================
// TYPES & HELPERS
// ============================================

interface PairwiseMatch {
    users: [User, User];
    score: number;
}

export interface MatchGroup {
    members: User[];
    size: number;
    avgCompatibility: number;
}

const jaccardSimilarity = <T,>(setA: Set<T>, setB: Set<T>): number => {
    if (setA.size === 0 && setB.size === 0) return 1; // Both empty, perfect match
    if (setA.size === 0 || setB.size === 0) return 0; // One empty, no match
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
}

// ============================================
// USER MATCHING ALGORITHM
// ============================================

/**
 * Calculates a compatibility score between two users based on various criteria.
 */
export const calculateCompatibilityScore = (userA: User, userB: User): number => {
    const weights = ALGORITHM_WEIGHTS.matching;
    let score = 0;

    // 1. DATE/TIME COMPATIBILITY
    const datesA = new Set(userA.preferredDates || []);
    const datesB = new Set(userB.preferredDates || []);
    if (datesA.has('any') || datesB.has('any') || new Set([...datesA].filter(d => datesB.has(d))).size > 0) {
        score += weights.date_compatibility_weight;
    }

    // 2. INTEREST OVERLAP
    const interestsA = new Set(userA.interestIds || []);
    const interestsB = new Set(userB.interestIds || []);
    score += jaccardSimilarity(interestsA, interestsB) * weights.interest_overlap_weight;

    // 3. DEMOGRAPHIC PREFERENCES
    let demoScore = 0;
    const ageA = userA.age || 0;
    const ageB = userB.age || 0;
    const [minA, maxA] = userA.matchPreferences?.ageRange || [18, 99];
    const [minB, maxB] = userB.matchPreferences?.ageRange || [18, 99];
    if (ageB >= minA && ageB <= maxA && ageA >= minB && ageA <= maxB) {
        demoScore += 1/3;
    }
    demoScore += 1/3; // Simplified gender for now
    const languagesA = new Set(userA.languages || []);
    const languagesB = new Set(userB.languages || []);
    if (new Set([...languagesA].filter(l => languagesB.has(l))).size > 0) {
        demoScore += 1/3;
    }
    score += demoScore * weights.demographic_weight;

    // 4. SOCIAL CONNECTION
    let socialScore = 0;
    const friendsA = new Set(userA.friendIds || []);
    if (friendsA.has(userB.id)) {
        socialScore = 1.0; // Direct friends
    } else {
        const friendsB = new Set(userB.friendIds || []);
        const mutuals = new Set([...friendsA].filter(f => friendsB.has(f)));
        socialScore = Math.min(mutuals.size * 0.2, 0.5); // 0.2 per mutual, cap at 0.5
    }
    score += socialScore * weights.social_connection_weight;

    // 5. ACTIVITY HISTORY SIMILARITY
    const historyA = new Set(userA.activityHistory?.attended.map(a => a.activityId) || []);
    const historyB = new Set(userB.activityHistory?.attended.map(a => a.activityId) || []);
    score += jaccardSimilarity(historyA, historyB) * weights.history_similarity_weight;

    return Math.min(100, score * 100);
};

/**
 * Takes individual matches and forms optimal groups of 2-8 people.
 */
export const formMatchGroups = (interestedUsers: User[]): MatchGroup[] => {
    const { min_match_score } = ALGORITHM_WEIGHTS.thresholds;
    const { max_group_size } = ALGORITHM_WEIGHTS.groupFormation;
    const groups: MatchGroup[] = [];
    if (interestedUsers.length < 2) return [];

    const pairwiseMatches: PairwiseMatch[] = [];
    const compatibilityCache = new Map<string, number>();

    for (let i = 0; i < interestedUsers.length; i++) {
        for (let j = i + 1; j < interestedUsers.length; j++) {
            const userA = interestedUsers[i];
            const userB = interestedUsers[j];
            const score = calculateCompatibilityScore(userA, userB);
            
            compatibilityCache.set(`${userA.id}-${userB.id}`, score);
            compatibilityCache.set(`${userB.id}-${userA.id}`, score);
            
            if (score >= min_match_score) {
                pairwiseMatches.push({ users: [userA, userB], score });
            }
        }
    }

    pairwiseMatches.sort((a, b) => b.score - a.score);

    const assignedUserIds = new Set<string>();

    for (const match of pairwiseMatches) {
        const [userA, userB] = match.users;
        if (assignedUserIds.has(userA.id) || assignedUserIds.has(userB.id)) {
            continue;
        }

        const newGroup: User[] = [userA, userB];
        assignedUserIds.add(userA.id);
        assignedUserIds.add(userB.id);

        for (const candidate of interestedUsers) {
            if (assignedUserIds.has(candidate.id) || newGroup.length >= max_group_size) continue;
            
            let isCompatibleWithAll = true;
            for(const member of newGroup) {
                const pairScore = compatibilityCache.get(`${candidate.id}-${member.id}`) || 0;
                if (pairScore < min_match_score) {
                    isCompatibleWithAll = false;
                    break;
                }
            }

            if (isCompatibleWithAll) {
                newGroup.push(candidate);
                assignedUserIds.add(candidate.id);
            }
        }
        
        if (newGroup.length >= 2) {
            let totalScore = 0;
            let pairs = 0;
            for(let i=0; i<newGroup.length; i++) {
                for(let j=i+1; j<newGroup.length; j++) {
                    totalScore += compatibilityCache.get(`${newGroup[i].id}-${newGroup[j].id}`) || 0;
                    pairs++;
                }
            }

            groups.push({
                members: newGroup,
                size: newGroup.length,
                avgCompatibility: pairs > 0 ? totalScore / pairs : 0
            });
        }
    }

    return groups.sort((a,b) => b.avgCompatibility - a.avgCompatibility);
};