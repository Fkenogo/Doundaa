// This file centralizes all tunable parameters for the matching and recommendation algorithms.
// This allows for easy adjustments without changing the core logic.

export const ALGORITHM_WEIGHTS = {
    // Weights for ranking activities in the "For You" feed
    feedRanking: {
        interest_match_weight: 0.50, // Direct interest match
        cluster_match_weight: 0.20,  // Belongs to the same user "vibe"
        adjacent_match_weight: 0.10, // Related to user's interests
        quality_weight: 0.10,        // Provider rating
        proximity_weight: 0.05,      // How close the activity is
        recency_boost: 0.50,         // 50% score boost for new activities (<= 48h old)
    },
    
    // Weights for calculating compatibility score between two users
    matching: {
        date_compatibility_weight: 0.40,
        interest_overlap_weight: 0.25,
        demographic_weight: 0.15,
        social_connection_weight: 0.10,
        history_similarity_weight: 0.10,
    },
    
    // Thresholds used across the algorithms
    thresholds: {
        min_match_score: 40,             // Minimum compatibility score to form a group
        min_interest_matches_for_feed: 1,// Unused, but available for future filtering
        // FIX: Add missing property `discovery_mode_percentage` to fix type error.
        discovery_mode_percentage: 0.15, // Percentage of discovery items to inject into feed
    },
    
    // Parameters for group formation
    groupFormation: {
        min_group_size: 2,
        max_group_size: 8,
        optimal_group_size: 4,
    }
};