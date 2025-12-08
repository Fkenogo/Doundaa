// This file contains the "intelligence" for the FYP algorithm.

// 1. INTEREST CLUSTERS
// These clusters represent user personas or "vibes". If a user has several interests
// from a cluster, we can recommend other activities from that same cluster.
export const INTEREST_CLUSTERS: { [key: string]: string[] } = {
  activeExplorers: [
    'adv_hiking', 'adv_climbing', 'adv_camping', 'adv_sunrise_hikes', 'adv_trail_running',
    'arts_photography', 'food_coffee_tasting', 'adv_safaris',
  ],
  urbanCultureVultures: [
    'arts_galleries', 'food_street_tours', 'arts_live_music', 'social_coffee_meetups',
    'night_rooftop', 'arts_museums', 'arts_film_screenings', 'exp_urban_exploring'
  ],
  wellnessWarriors: [
    'sports_yoga', 'food_healthy_eating', 'adv_walks', 'sports_meditation',
    'well_self_care', 'well_mindfulness', 'well_retreats', 'food_juice_bars'
  ],
  nightCrew: [
    'night_club_nights', 'night_cocktail_bars', 'arts_live_music', 'night_dance_parties',
    'night_dj_sets', 'social_happy_hour', 'games_karaoke'
  ],
  weekendWarriors: [
    'adv_hiking', 'adv_camping', 'food_beer_tasting', 'adv_boat_trips',
    'exp_day_trips', 'exp_weekend_getaways', 'social_group_hangouts'
  ]
};

// Create a map for quick lookup: interestId -> clusterName[]
export const INTEREST_TO_CLUSTER_MAP = new Map<string, string[]>();
Object.entries(INTEREST_CLUSTERS).forEach(([clusterName, interestIds]) => {
  interestIds.forEach(id => {
    if (!INTEREST_TO_CLUSTER_MAP.has(id)) {
      INTEREST_TO_CLUSTER_MAP.set(id, []);
    }
    INTEREST_TO_CLUSTER_MAP.get(id)!.push(clusterName);
  });
});

// 2. ADJACENT INTERESTS
// This helps to slightly broaden a user's feed. If they like X, they might also like Y.
export const ADJACENT_INTERESTS: { [key: string]: { id: string; coOccurrenceRate: number }[] } = {
  adv_hiking: [{ id: 'adv_walks', coOccurrenceRate: 0.8 }, { id: 'adv_trail_running', coOccurrenceRate: 0.6 }, {id: 'adv_camping', coOccurrenceRate: 0.5}],
  adv_climbing: [{ id: 'adv_rock_climbing', coOccurrenceRate: 0.9 }, { id: 'sports_climbing_gyms', coOccurrenceRate: 0.7 }],
  food_restaurants: [{ id: 'food_street_tours', coOccurrenceRate: 0.7 }, { id: 'food_brunch_clubs', coOccurrenceRate: 0.6 }],
  arts_galleries: [{ id: 'arts_museums', coOccurrenceRate: 0.85 }],
  sports_running: [{ id: 'adv_trail_running', coOccurrenceRate: 0.5 }, { id: 'sports_marathon_training', coOccurrenceRate: 0.7 }],
  sports_yoga: [{ id: 'sports_meditation', coOccurrenceRate: 0.9 }, { id: 'well_mindfulness', coOccurrenceRate: 0.8 }],
  social_coffee_meetups: [{ id: 'learn_book_clubs', coOccurrenceRate: 0.4 }, {id: 'social_new_friends', coOccurrenceRate: 0.6}],
  night_cocktail_bars: [{ id: 'night_rooftop', coOccurrenceRate: 0.75 }, {id: 'night_jazz', coOccurrenceRate: 0.5}],
};