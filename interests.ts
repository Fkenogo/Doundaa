export interface Interest {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

export interface MainCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  colors: {
    primary: string;
    light: string;
    dark: string;
  };
}

export const MAIN_CATEGORIES: MainCategory[] = [
  { 
    id: 'adventure', name: 'Adventure Seeker', emoji: '🏔️', description: 'Outdoors, hiking, camping, extreme sports',
    colors: { primary: '#2D9F5E', light: '#E8F5ED', dark: '#1D6F3E' }
  },
  { 
    id: 'food', name: 'Foodie', emoji: '🍽️', description: 'Restaurants, cooking, markets, food tours',
    colors: { primary: '#FF7F3F', light: '#FFE8DB', dark: '#CC5F2F' }
  },
  { 
    id: 'arts', name: 'Creative Soul', emoji: '🎨', description: 'Arts, culture, museums, crafts',
    colors: { primary: '#8B5CF6', light: '#F3EFFF', dark: '#6B3FC6' }
  },
  { 
    id: 'nightlife', name: 'Night Owl', emoji: '🎶', description: 'Music, clubs, bars, nightlife',
    colors: { primary: '#E91E8C', light: '#FCE7F3', dark: '#B9155D' }
  },
  { 
    id: 'sports', name: 'Fitness Enthusiast', emoji: '💪', description: 'Sports, gym, yoga, running',
    colors: { primary: '#EF4444', light: '#FEE2E2', dark: '#B91C1C' }
  },
  { 
    id: 'learning', name: 'Lifelong Learner', emoji: '📚', description: 'Workshops, languages, networking',
    colors: { primary: '#3B82F6', light: '#DBEAFE', dark: '#1E40AF' }
  },
  { 
    id: 'games', name: 'Fun & Games', emoji: '🎮', description: 'Board games, trivia, entertainment',
    colors: { primary: '#F59E0B', light: '#FEF3C7', dark: '#B45309' }
  },
  { 
    id: 'wellness', name: 'Wellness Warrior', emoji: '🧘', description: 'Yoga, meditation, self-care',
    colors: { primary: '#14B8A6', light: '#CCFBF1', dark: '#0D9488' }
  },
  { 
    id: 'exploration', name: 'Explorer', emoji: '✈️', description: 'Tourism, day trips, hidden gems',
    colors: { primary: '#06B6D4', light: '#CFFAFE', dark: '#0891B2' }
  },
  { 
    id: 'social', name: 'Social Butterfly', emoji: '🤝', description: 'Meetups, networking, making friends',
    colors: { primary: '#FB7185', light: '#FCE7F3', dark: '#E11D48' }
  },
];

const allInterests: (Omit<Interest, 'category'> & { category: string[] })[] = [
  // ADVENTURE & OUTDOORS
  { id: 'adv_hiking', name: 'Hiking', emoji: '🥾', category: ['adventure'] },
  { id: 'adv_climbing', name: 'Mountain Climbing', emoji: '⛰️', category: ['adventure'] },
  { id: 'adv_walks', name: 'Nature Walks', emoji: '🚶', category: ['adventure', 'wellness'] },
  { id: 'adv_camping', name: 'Camping', emoji: '🏕️', category: ['adventure'] },
  { id: 'adv_sunrise_hikes', name: 'Sunrise Hikes', emoji: '🌄', category: ['adventure'] },
  { id: 'adv_sunset_trails', name: 'Sunset Trails', emoji: '🌅', category: ['adventure'] },
  { id: 'adv_kayaking', name: 'Kayaking', emoji: '🚣', category: ['adventure', 'sports'] },
  { id: 'adv_swimming', name: 'Swimming', emoji: '🏊', category: ['adventure', 'sports'] },
  { id: 'adv_boat_trips', name: 'Boat Trips', emoji: '🛶', category: ['adventure', 'exploration'] },
  { id: 'adv_beach', name: 'Beach Hangouts', emoji: '🏖️', category: ['adventure', 'social'] },
  { id: 'adv_fishing', name: 'Fishing', emoji: '🎣', category: ['adventure'] },
  { id: 'adv_mountain_biking', name: 'Mountain Biking', emoji: '🚴', category: ['adventure', 'sports'] },
  { id: 'adv_rock_climbing', name: 'Rock Climbing', emoji: '🧗', category: ['adventure', 'sports'] },
  { id: 'adv_ziplining', name: 'Zip-lining', emoji: '🪂', category: ['adventure'] },
  { id: 'adv_trail_running', name: 'Trail Running', emoji: '🏃', category: ['adventure', 'sports'] },
  { id: 'adv_gorilla_trekking', name: 'Gorilla Trekking', emoji: '🦍', category: ['adventure', 'exploration'] },
  { id: 'adv_safaris', name: 'Wildlife Safaris', emoji: '🐘', category: ['adventure', 'exploration'] },
  { id: 'adv_forest_bathing', name: 'Forest Bathing', emoji: '🌳', category: ['adventure', 'wellness'] },
  { id: 'adv_bird_watching', name: 'Bird Watching', emoji: '🦜', category: ['adventure'] },
  { id: 'adv_botanical_gardens', name: 'Botanical Gardens', emoji: '🌺', category: ['adventure', 'exploration'] },
  { id: 'adv_eco_tourism', name: 'Eco-Tourism', emoji: '♻️', category: ['adventure', 'social'] },
  { id: 'adv_conservation', name: 'Conservation', emoji: '🌱', category: ['adventure', 'social'] },

  // FOOD & DRINK
  { id: 'food_restaurants', name: 'Restaurant Hopping', emoji: '🍽️', category: ['food'] },
  { id: 'food_street_tours', name: 'Street Food Tours', emoji: '🍜', category: ['food'] },
  { id: 'food_local_cuisine', name: 'Local Cuisine', emoji: '🥘', category: ['food'] },
  { id: 'food_brunch_clubs', name: 'Brunch Clubs', emoji: '🍱', category: ['food', 'social'] },
  { id: 'food_coffee_tasting', name: 'Coffee Tasting', emoji: '☕', category: ['food'] },
  { id: 'food_wine_tasting', name: 'Wine Tasting', emoji: '🍷', category: ['food'] },
  { id: 'food_beer_tasting', name: 'Beer Tasting', emoji: '🍺', category: ['food'] },
  { id: 'food_juice_bars', name: 'Juice Bars', emoji: '🧃', category: ['food', 'wellness'] },
  { id: 'food_cooking_classes', name: 'Cooking Classes', emoji: '👨‍🍳', category: ['food', 'learning'] },
  { id: 'food_baking_workshops', name: 'Baking Workshops', emoji: '🍞', category: ['food', 'learning'] },
  { id: 'food_farm_to_table', name: 'Farm-to-Table', emoji: '🌾', category: ['food'] },
  { id: 'food_healthy_eating', name: 'Healthy Eating', emoji: '🥗', category: ['food', 'wellness'] },
  { id: 'food_festivals', name: 'Food Festivals', emoji: '🌮', category: ['food', 'social'] },
  { id: 'food_pizza_nights', name: 'Pizza Nights', emoji: '🍕', category: ['food', 'social'] },
  { id: 'food_market_exploring', name: 'Market Exploring', emoji: '🛒', category: ['food', 'exploration'] },
  { id: 'food_produce_hunting', name: 'Fresh Produce Hunting', emoji: '🥬', category: ['food'] },
  { id: 'food_local_products', name: 'Local Products', emoji: '🍯', category: ['food'] },

  // ARTS & CULTURE
  { id: 'arts_galleries', name: 'Art Galleries', emoji: '🎨', category: ['arts'] },
  { id: 'arts_museums', name: 'Museum Visits', emoji: '🖼️', category: ['arts', 'learning'] },
  { id: 'arts_theater', name: 'Theater', emoji: '🎭', category: ['arts'] },
  { id: 'arts_photography', name: 'Photography', emoji: '📸', category: ['arts'] },
  { id: 'arts_painting_classes', name: 'Painting Classes', emoji: '🖌️', category: ['arts', 'learning'] },
  { id: 'arts_pottery_workshops', name: 'Pottery Workshops', emoji: '🏺', category: ['arts', 'learning'] },
  { id: 'arts_craft_making', name: 'Craft Making', emoji: '✂️', category: ['arts'] },
  { id: 'arts_traditional_crafts', name: 'Traditional Crafts', emoji: '🧵', category: ['arts'] },
  { id: 'arts_live_music', name: 'Live Music', emoji: '🎵', category: ['arts', 'nightlife'] },
  { id: 'arts_dance_performances', name: 'Dance Performances', emoji: '💃', category: ['arts'] },
  { id: 'arts_drumming', name: 'Drumming', emoji: '🥁', category: ['arts'] },
  { id: 'arts_open_mic', name: 'Open Mic Nights', emoji: '🎤', category: ['arts', 'nightlife'] },
  { id: 'arts_cultural_shows', name: 'Cultural Shows', emoji: '🎪', category: ['arts'] },
  { id: 'arts_film_screenings', name: 'Film Screenings', emoji: '🎬', category: ['arts', 'games'] },
  { id: 'arts_historical_sites', name: 'Historical Sites', emoji: '🏛️', category: ['arts', 'exploration'] },
  { id: 'arts_cultural_heritage', name: 'Cultural Heritage', emoji: '🗿', category: ['arts'] },
  { id: 'arts_architecture_tours', name: 'Architecture Tours', emoji: '🕌', category: ['arts', 'exploration'] },
  { id: 'arts_storytelling', name: 'Storytelling Sessions', emoji: '📖', category: ['arts'] },
  { id: 'arts_writing_workshops', name: 'Writing Workshops', emoji: '✍️', category: ['arts', 'learning'] },
  { id: 'arts_improv_classes', name: 'Improv Classes', emoji: '🎭', category: ['arts', 'learning'] },
  { id: 'arts_photo_walks', name: 'Photo Walks', emoji: '📷', category: ['arts', 'social'] },

  // MUSIC & NIGHTLIFE
  { id: 'night_acoustic', name: 'Acoustic Sessions', emoji: '🎸', category: ['nightlife'] },
  { id: 'night_jazz', name: 'Jazz', emoji: '🎹', category: ['nightlife'] },
  { id: 'night_dj_sets', name: 'Electronic/DJ Sets', emoji: '🎧', category: ['nightlife'] },
  { id: 'night_afrobeat', name: 'Afrobeat', emoji: '🥁', category: ['nightlife'] },
  { id: 'night_hip_hop', name: 'Hip Hop', emoji: '🎤', category: ['nightlife'] },
  { id: 'night_traditional_music', name: 'Traditional Music', emoji: '🎺', category: ['nightlife', 'arts'] },
  { id: 'night_cocktail_bars', name: 'Cocktail Bars', emoji: '🍹', category: ['nightlife', 'food'] },
  { id: 'night_club_nights', name: 'Club Nights', emoji: '🎉', category: ['nightlife'] },
  { id: 'night_rooftop', name: 'Rooftop Hangouts', emoji: '🌃', category: ['nightlife', 'social'] },
  { id: 'night_markets', name: 'Night Markets', emoji: '🎆', category: ['nightlife', 'food'] },
  { id: 'night_sunset_sessions', name: 'Sunset Sessions', emoji: '🌙', category: ['nightlife'] },
  { id: 'night_dance_parties', name: 'Dance Parties', emoji: '🕺', category: ['nightlife'] },
  { id: 'night_stargazing', name: 'Stargazing', emoji: '🌌', category: ['nightlife', 'adventure'] },

  // SPORTS & FITNESS
  { id: 'sports_football', name: 'Football/Soccer', emoji: '⚽', category: ['sports'] },
  { id: 'sports_basketball', name: 'Basketball', emoji: '🏀', category: ['sports'] },
  { id: 'sports_volleyball', name: 'Volleyball', emoji: '🏐', category: ['sports'] },
  { id: 'sports_rugby', name: 'Rugby', emoji: '🏉', category: ['sports'] },
  { id: 'sports_tennis', name: 'Tennis', emoji: '🎾', category: ['sports'] },
  { id: 'sports_running', name: 'Running', emoji: '🏃', category: ['sports'] },
  { id: 'sports_cycling', name: 'Cycling', emoji: '🚴', category: ['sports'] },
  { id: 'sports_yoga', name: 'Yoga', emoji: '🧘', category: ['sports', 'wellness'] },
  { id: 'sports_boxing', name: 'Boxing', emoji: '🥊', category: ['sports'] },
  { id: 'sports_crossfit', name: 'CrossFit', emoji: '🤸', category: ['sports'] },
  { id: 'sports_gym', name: 'Gym Workouts', emoji: '🏋️', category: ['sports'] },
  { id: 'sports_table_tennis', name: 'Table Tennis', emoji: '🏓', category: ['sports', 'games'] },
  { id: 'sports_billiards', name: 'Pool/Billiards', emoji: '🎱', category: ['sports', 'games'] },
  { id: 'sports_darts', name: 'Darts', emoji: '🎯', category: ['sports', 'games'] },
  { id: 'sports_mini_golf', name: 'Mini Golf', emoji: '⛳', category: ['sports', 'games'] },
  { id: 'sports_frisbee', name: 'Frisbee', emoji: '🥏', category: ['sports'] },
  { id: 'sports_meditation', name: 'Meditation', emoji: '🧘', category: ['sports', 'wellness'] },
  { id: 'sports_fitness_classes', name: 'Fitness Classes', emoji: '💪', category: ['sports'] },
  { id: 'sports_walking_groups', name: 'Walking Groups', emoji: '🚶', category: ['sports', 'social'] },
  { id: 'sports_marathon_training', name: 'Marathon Training', emoji: '🏃', category: ['sports'] },
  { id: 'sports_climbing_gyms', name: 'Climbing Gyms', emoji: '🧗', category: ['sports'] },

  // LEARNING & PERSONAL GROWTH
  { id: 'learn_language_exchange', name: 'Language Exchange', emoji: '🗣️', category: ['learning', 'social'] },
  { id: 'learn_kinyarwanda', name: 'Kinyarwanda Learning', emoji: '🇷🇼', category: ['learning'] },
  { id: 'learn_french', name: 'French Practice', emoji: '🇫🇷', category: ['learning'] },
  { id: 'learn_english', name: 'English Practice', emoji: '🇬🇧', category: ['learning'] },
  { id: 'learn_swahili', name: 'Swahili Learning', emoji: '🌍', category: ['learning'] },
  { id: 'learn_tech_workshops', name: 'Tech Workshops', emoji: '💻', category: ['learning'] },
  { id: 'learn_digital_skills', name: 'Digital Skills', emoji: '📱', category: ['learning'] },
  { id: 'learn_entrepreneurship', name: 'Entrepreneurship', emoji: '💼', category: ['learning'] },
  { id: 'learn_business_networking', name: 'Business Networking', emoji: '📊', category: ['learning', 'social'] },
  { id: 'learn_educational_talks', name: 'Educational Talks', emoji: '🎓', category: ['learning'] },
  { id: 'learn_personal_development', name: 'Personal Development', emoji: '🧠', category: ['learning', 'wellness'] },
  { id: 'learn_book_clubs', name: 'Book Clubs', emoji: '📖', category: ['learning', 'social'] },
  { id: 'learn_writing_groups', name: 'Writing Groups', emoji: '✍️', category: ['learning', 'social'] },
  { id: 'learn_networking_events', name: 'Networking Events', emoji: '🤝', category: ['learning', 'social'] },
  { id: 'learn_innovation_meetups', name: 'Innovation Meetups', emoji: '💡', category: ['learning'] },
  { id: 'learn_startup_events', name: 'Startup Events', emoji: '🚀', category: ['learning'] },
  { id: 'learn_professional_dev', name: 'Professional Development', emoji: '👔', category: ['learning'] },
  { id: 'learn_panel_discussions', name: 'Panel Discussions', emoji: '🎙️', category: ['learning'] },

  // GAMES & ENTERTAINMENT
  { id: 'games_video', name: 'Video Games', emoji: '🎮', category: ['games'] },
  { id: 'games_card', name: 'Card Games', emoji: '🃏', category: ['games', 'social'] },
  { id: 'games_board', name: 'Board Games', emoji: '🎲', category: ['games', 'social'] },
  { id: 'games_chess', name: 'Chess', emoji: '♟️', category: ['games'] },
  { id: 'games_puzzle', name: 'Puzzle Games', emoji: '🧩', category: ['games'] },
  { id: 'games_karaoke', name: 'Karaoke', emoji: '🎤', category: ['games', 'nightlife'] },
  { id: 'games_bowling', name: 'Bowling', emoji: '🎳', category: ['games', 'sports'] },
  { id: 'games_game_nights', name: 'Game Nights', emoji: '🎰', category: ['games', 'social'] },
  { id: 'games_trivia_nights', name: 'Trivia Nights', emoji: '🎪', category: ['games', 'nightlife'] },
  { id: 'games_comedy_shows', name: 'Comedy Shows', emoji: '🎭', category: ['games', 'arts'] },
  { id: 'games_movie_nights', name: 'Movie Nights', emoji: '🎬', category: ['games', 'social'] },
  { id: 'games_watch_parties', name: 'Watch Parties', emoji: '📺', category: ['games', 'social'] },
  { id: 'games_escape_rooms', name: 'Escape Rooms', emoji: '🎯', category: ['games'] },
  { id: 'games_arcade', name: 'Arcade Games', emoji: '🏹', category: ['games'] },

  // SOCIAL & COMMUNITY
  { id: 'social_deep_convos', name: 'Deep Conversations', emoji: '🗣️', category: ['social'] },
  { id: 'social_coffee_meetups', name: 'Coffee Meetups', emoji: '☕', category: ['social', 'food'] },
  { id: 'social_happy_hour', name: 'Happy Hour', emoji: '🥂', category: ['social', 'nightlife'] },
  { id: 'social_party_planning', name: 'Party Planning', emoji: '🎉', category: ['social'] },
  { id: 'social_group_hangouts', name: 'Group Hangouts', emoji: '👥', category: ['social'] },
  { id: 'social_new_friends', name: 'Making New Friends', emoji: '🤗', category: ['social'] },
  { id: 'social_volunteering', name: 'Volunteering', emoji: '🤲', category: ['social'] },
  { id: 'social_community_projects', name: 'Community Projects', emoji: '🌍', category: ['social'] },
  { id: 'social_cleanup', name: 'Environmental Cleanup', emoji: '♻️', category: ['social', 'adventure'] },
  { id: 'social_neighborhood_events', name: 'Neighborhood Events', emoji: '🏘️', category: ['social'] },
  { id: 'social_charity_events', name: 'Charity Events', emoji: '🎁', category: ['social'] },
  { id: 'social_youth_mentoring', name: 'Youth Mentoring', emoji: '👶', category: ['social', 'learning'] },
  { id: 'social_meetups', name: 'Meetups', emoji: '🤝', category: ['social'] },
  { id: 'social_clubs', name: 'Social Clubs', emoji: '📱', category: ['social'] },

  // TOURISM & EXPLORATION
  { id: 'exp_city_tours', name: 'City Tours', emoji: '🗺️', category: ['exploration'] },
  { id: 'exp_urban_exploring', name: 'Urban Exploring', emoji: '🏙️', category: ['exploration'] },
  { id: 'exp_neighborhood_walks', name: 'Neighborhood Walks', emoji: '🏘️', category: ['exploration', 'social'] },
  { id: 'exp_hidden_gems', name: 'Hidden Gems', emoji: '🚶', category: ['exploration'] },
  { id: 'exp_local_secrets', name: 'Local Secrets', emoji: '📍', category: ['exploration'] },
  { id: 'exp_landmark_visits', name: 'Landmark Visits', emoji: '🏛️', category: ['exploration', 'arts'] },
  { id: 'exp_tourist_attractions', name: 'Tourist Attractions', emoji: '📸', category: ['exploration'] },
  { id: 'exp_day_trips', name: 'Day Trips', emoji: '🚌', category: ['exploration'] },
  { id: 'exp_national_parks', name: 'National Parks', emoji: '🏞️', category: ['exploration', 'adventure'] },
  { id: 'exp_primate_tracking', name: 'Primate Tracking', emoji: '🦍', category: ['exploration', 'adventure'] },
  { id: 'exp_volcano_visits', name: 'Volcano Visits', emoji: '🌋', category: ['exploration', 'adventure'] },
  { id: 'exp_gem_tours', name: 'Gem Tours', emoji: '💎', category: ['exploration'] },
  { id: 'exp_backpacking', name: 'Backpacking', emoji: '🎒', category: ['exploration', 'adventure'] },
  { id: 'exp_road_trips', name: 'Road Trips', emoji: '🚗', category: ['exploration'] },
  { id: 'exp_train_journeys', name: 'Train Journeys', emoji: '🚂', category: ['exploration'] },
  { id: 'exp_hotel_hopping', name: 'Hotel Hopping', emoji: '🏨', category: ['exploration'] },
  { id: 'exp_adventure_travel', name: 'Adventure Travel', emoji: '🏕️', category: ['exploration', 'adventure'] },
  { id: 'exp_weekend_getaways', name: 'Weekend Getaways', emoji: '🧳', category: ['exploration'] },
  { id: 'exp_photography_tours', name: 'Photography Tours', emoji: '📷', category: ['exploration', 'arts'] },
  { id: 'exp_cultural_immersion', name: 'Cultural Immersion', emoji: '🌍', category: ['exploration', 'arts'] },

  // WELLNESS & SPIRITUALITY
  { id: 'well_spa_days', name: 'Spa Days', emoji: '💆', category: ['wellness'] },
  { id: 'well_retreats', name: 'Wellness Retreats', emoji: '🌿', category: ['wellness'] },
  { id: 'well_health_fitness', name: 'Health & Fitness', emoji: '🏥', category: ['wellness', 'sports'] },
  { id: 'well_self_care', name: 'Self-Care', emoji: '🧖', category: ['wellness'] },
  { id: 'well_holistic_health', name: 'Holistic Health', emoji: '🌱', category: ['wellness'] },
  { id: 'well_spiritual_gatherings', name: 'Spiritual Gatherings', emoji: '🙏', category: ['wellness'] },
  { id: 'well_church_events', name: 'Church Events', emoji: '⛪', category: ['wellness', 'social'] },
  { id: 'well_mosque_visits', name: 'Mosque Visits', emoji: '🕌', category: ['wellness', 'social'] },
  { id: 'well_mindfulness', name: 'Mindfulness', emoji: '🧘', category: ['wellness'] },
  { id: 'well_prayer_groups', name: 'Prayer Groups', emoji: '📿', category: ['wellness', 'social'] },
  { id: 'well_sunrise_rituals', name: 'Sunrise Rituals', emoji: '🌅', category: ['wellness'] },
  { id: 'well_moon_circles', name: 'Moon Circles', emoji: '🌙', category: ['wellness'] },
  { id: 'well_energy_healing', name: 'Energy Healing', emoji: '🔮', category: ['wellness'] },

  // FAMILY & KIDS
  { id: 'fam_family_friendly', name: 'Family-Friendly', emoji: '👶', category: ['social'] },
  { id: 'fam_kids_events', name: 'Kids Events', emoji: '🎠', category: ['social'] },
  { id: 'fam_children_workshops', name: 'Children\'s Workshops', emoji: '🎨', category: ['social', 'learning'] },
  { id: 'fam_family_outings', name: 'Family Outings', emoji: '🎪', category: ['social'] },
  { id: 'fam_picnics', name: 'Picnics', emoji: '🏞️', category: ['social', 'food'] },
  { id: 'fam_birthday_parties', name: 'Birthday Parties', emoji: '🎂', category: ['social'] },
  { id: 'fam_kids_festivals', name: 'Kids Festivals', emoji: '🎈', category: ['social'] },
  { id: 'fam_adventure_parks', name: 'Adventure Parks', emoji: '🏰', category: ['social', 'adventure'] },
  { id: 'fam_petting_zoos', name: 'Petting Zoos', emoji: '🐾', category: ['social', 'adventure'] },
  { id: 'fam_children_theater', name: 'Children\'s Theater', emoji: '🎭', category: ['social', 'arts'] },

  // ANIMALS & NATURE
  { id: 'anim_dog_walking', name: 'Dog Walking', emoji: '🐕', category: ['adventure', 'social'] },
  { id: 'anim_cat_cafes', name: 'Cat Cafes', emoji: '🐈', category: ['adventure', 'social'] },
  { id: 'anim_animal_sanctuaries', name: 'Animal Sanctuaries', emoji: '🐾', category: ['adventure'] },
  { id: 'anim_zoo_visits', name: 'Zoo Visits', emoji: '🦜', category: ['adventure'] },
  { id: 'anim_horse_riding', name: 'Horse Riding', emoji: '🐴', category: ['adventure', 'sports'] },
  { id: 'anim_wildlife_watching', name: 'Wildlife Watching', emoji: '🦒', category: ['adventure'] },
  { id: 'anim_insect_safari', name: 'Insect Safari', emoji: '🐛', category: ['adventure'] },
  { id: 'anim_butterfly_gardens', name: 'Butterfly Gardens', emoji: '🦋', category: ['adventure'] },
  { id: 'anim_tree_planting', name: 'Tree Planting', emoji: '🌳', category: ['adventure', 'social'] },

  // SPECIAL INTERESTS
  { id: 'spec_herbalism', name: 'Herbalism', emoji: '🌿', category: ['arts', 'learning'] },
  { id: 'spec_foraging', name: 'Foraging', emoji: '🍄', category: ['arts', 'adventure'] },
  { id: 'spec_campfire_stories', name: 'Campfire Stories', emoji: '🔥', category: ['arts', 'social'] },
  { id: 'spec_circus_arts', name: 'Circus Arts', emoji: '🎪', category: ['arts'] },
  { id: 'spec_cosplay', name: 'Cosplay', emoji: '🎭', category: ['arts', 'social'] },
  { id: 'spec_rare_books', name: 'Rare Books', emoji: '📚', category: ['arts', 'learning'] },
  { id: 'spec_vinyl_collecting', name: 'Vinyl Collecting', emoji: '🎼', category: ['arts'] },
  { id: 'spec_antiques', name: 'Antiques', emoji: '🏺', category: ['arts', 'exploration'] },
  { id: 'spec_knitting_circles', name: 'Knitting Circles', emoji: '🧵', category: ['arts', 'social'] },
  { id: 'spec_plant_parents', name: 'Plant Parents', emoji: '🪴', category: ['arts', 'social'] },
  { id: 'spec_astrology', name: 'Astrology', emoji: '🌙', category: ['arts', 'wellness'] },
  { id: 'spec_tarot_reading', name: 'Tarot Reading', emoji: '🔮', category: ['arts', 'wellness'] },

  // SOCIAL CAUSES
  { id: 'cause_sustainability', name: 'Sustainability', emoji: '🌱', category: ['social', 'learning'] },
  { id: 'cause_zero_waste', name: 'Zero Waste Living', emoji: '♻️', category: ['social'] },
  { id: 'cause_climate_action', name: 'Climate Action', emoji: '🌍', category: ['social'] },
  { id: 'cause_lgbtq_events', name: 'LGBTQ+ Events', emoji: '🏳️‍🌈', category: ['social'] },
  { id: 'cause_womens_empowerment', name: 'Women\'s Empowerment', emoji: '👩', category: ['social'] },
  { id: 'cause_youth_programs', name: 'Youth Programs', emoji: '🧑', category: ['social'] },
  { id: 'cause_mental_health', name: 'Mental Health Awareness', emoji: '💚', category: ['social', 'wellness'] },
  { id: 'cause_social_justice', name: 'Social Justice', emoji: '✊', category: ['social'] },
];

export const DETAILED_INTERESTS: Interest[] = allInterests.flatMap(interest => 
    interest.category.map(cat => ({
        id: interest.id,
        name: interest.name,
        emoji: interest.emoji,
        category: cat
    }))
);

export const ALL_INTERESTS_MAP = new Map(DETAILED_INTERESTS.map(i => [i.id, i]));