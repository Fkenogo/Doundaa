
import React, { useState, useMemo } from 'react';
import { mockActivities, mockActivitiesTrending, mockPopularActivities } from '../../constants';
import ActivityCard from '../ActivityCard';
import FilterBar from '../FilterBar';
import { Activity, Page, Provider, User } from '../../types';
import { PlusCircleIcon } from '../icons';
import { INTEREST_TO_CLUSTER_MAP, ADJACENT_INTERESTS } from '../../interestClusters';
import { ALGORITHM_WEIGHTS } from '../../algorithmConfig';

interface DiscoveryPageProps {
  onNavigate: (page: Page, profileUser?: User | Provider) => void;
  onStartConversation: (provider: Provider) => void;
  isAuthenticated: boolean;
  onRequestAuth: () => void;
  userInterests: string[];
  currentUser: User | null;
}

const shuffleSlightly = (array: Activity[]): Activity[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ onNavigate, onStartConversation, isAuthenticated, onRequestAuth, userInterests, currentUser }) => {
  const [activities, setActivities] = useState({
      forYou: mockActivities,
      nearby: mockActivities.filter(a => a.distance < 10),
      trending: mockActivitiesTrending,
      happeningNow: mockActivities.filter(a => a.isTimeSensitive),
  });
  
  const [activeTab, setActiveTab] = useState('For You');

  const allActivities = useMemo(() => mockActivities, []);
  
  const activitiesFollowing = useMemo(() => {
    return allActivities.filter(activity => activity.provider.following);
  }, [allActivities]);


  const handleFollowToggle = (providerId: string, isFollowing: boolean) => {
    const updateActivities = (activityList: Activity[]) => 
      activityList.map(activity => 
        activity.provider.id === providerId 
          ? { ...activity, provider: { ...activity.provider, following: isFollowing } } 
          : activity
      );

    setActivities(prev => ({
        ...prev,
        forYou: updateActivities(prev.forYou),
        nearby: updateActivities(prev.nearby),
        trending: updateActivities(prev.trending),
        happeningNow: updateActivities(prev.happeningNow),
    }));
  };
  
  const sortedForYouActivities = useMemo(() => {
    const isNewUser = !currentUser?.activityHistory?.attended || currentUser.activityHistory.attended.length === 0;

    if (isNewUser && userInterests.length === 0) {
        return mockPopularActivities.slice(0, 20);
    }

    const weights = ALGORITHM_WEIGHTS.feedRanking;
    const userInterestSet = new Set(userInterests);
    const viewedSet = new Set(currentUser?.viewedActivities || []);
    
    // Compute user clusters once
    const userClusters = new Set<string>();
    userInterests.forEach(interestId => {
        const clusters = INTEREST_TO_CLUSTER_MAP.get(interestId);
        if (clusters) clusters.forEach(cluster => userClusters.add(cluster));
    });

    const getActivityScore = (activity: Activity): number => {
        let score = 0;
        const activityInterestSet = new Set(activity.interestIds);

        // 1. DIRECT INTEREST MATCH (HIGHEST PRIORITY - boosted weight)
        const directMatches = activity.interestIds.filter(id => userInterestSet.has(id)).length;
        score += directMatches * (weights.interest_match_weight * 1.5);

        // 2. CLUSTER MATCH (VIBE COMPATIBILITY)
        const activityClusters = new Set<string>();
        activity.interestIds.forEach(id => {
            const clusters = INTEREST_TO_CLUSTER_MAP.get(id);
            if (clusters) clusters.forEach(cluster => activityClusters.add(cluster));
        });
        const commonClusters = [...userClusters].filter(c => activityClusters.has(c));
        score += commonClusters.length * weights.cluster_match_weight;

        // 3. ADJACENT INTERESTS (EXPANSION)
        let adjacentMatches = 0;
        userInterests.forEach(userInterestId => {
            const adjacent = ADJACENT_INTERESTS[userInterestId];
            if (adjacent) {
                adjacent.forEach(adjacentInterest => {
                    if (activityInterestSet.has(adjacentInterest.id) && !userInterestSet.has(adjacentInterest.id)) {
                        adjacentMatches += adjacentInterest.coOccurrenceRate;
                    }
                });
            }
        });
        score += adjacentMatches * weights.adjacent_match_weight;
        
        // 4. QUALITY & DISTANCE (SECONDARY)
        score += (activity.provider.rating / 5) * weights.quality_weight;
        score += (1 / (1 + Math.log(1 + activity.distance))) * weights.proximity_weight;

        // 5. FRESHNESS FACTOR: Penalty for viewed activities
        if (viewedSet.has(activity.id)) {
            score *= 0.4; // Heavy penalty for previously seen content
        }

        // 6. RECENCY BOOST
        const hoursSinceCreated = (Date.now() - activity.createdAt) / (1000 * 3600);
        if (hoursSinceCreated <= 48) {
            score *= (1 + weights.recency_boost);
        }

        // 7. SMALL JITTER for feed variety
        score *= (0.95 + Math.random() * 0.1);

        return score;
    };
      
    const scoredActivities = allActivities
        .map(activity => ({ activity, score: getActivityScore(activity) }))
        .sort((a, b) => b.score - a.score);

    const sortedActivities = scoredActivities
        .filter(item => item.score > 0 || isNewUser)
        .map(item => item.activity);

    // Inject Discovery Items if mode is enabled
    const discoveryPercentage = ALGORITHM_WEIGHTS.thresholds.discovery_mode_percentage;
    if (currentUser?.discoveryMode !== 'no' && sortedActivities.length > 0) {
        const discoveryCount = Math.floor(sortedActivities.length * discoveryPercentage);
        if (discoveryCount > 0) {
            const sortedActivityIds = new Set(sortedActivities.map(a => a.id));
            const discoveryCandidates = allActivities.filter(a => !sortedActivityIds.has(a.id));
            
            const shuffledCandidates = shuffleSlightly(discoveryCandidates);
            const discoveryItems = shuffledCandidates.slice(0, discoveryCount);
            
            const finalFeed = [];
            let discoveryIndex = 0;
            const discoveryInterval = Math.max(3, Math.floor(sortedActivities.length / discoveryItems.length));

            for (let i = 0; i < sortedActivities.length; i++) {
                finalFeed.push(sortedActivities[i]);
                if ((i + 1) % discoveryInterval === 0 && discoveryIndex < discoveryItems.length) {
                    finalFeed.push(discoveryItems[discoveryIndex]);
                    discoveryIndex++;
                }
            }
            return finalFeed;
        }
    }
    
    return sortedActivities;

  }, [allActivities, userInterests, currentUser]);


  const getVisibleActivities = () => {
    switch (activeTab) {
      case 'For You':
        return sortedForYouActivities;
      case 'Nearby':
        return activities.nearby;
      case 'Trending':
        return activities.trending;
      case 'Doundaa-ing Now':
        return activities.happeningNow;
      case 'Following':
        return activitiesFollowing;
      default:
        return sortedForYouActivities;
    }
  };

  const visibleActivities = getVisibleActivities();

  return (
    <div className="max-w-md mx-auto">
      <FilterBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />
      <div className="p-4 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Looking for where to <span className="text-teal-600">doundaa</span>?</h2>
        <div className="mt-3 relative">
          <input type="text" placeholder="Search activities, locations..." className="w-full bg-white border-transparent rounded-2xl py-3 pl-5 pr-12 focus:ring-2 focus:ring-teal-500 shadow-sm text-sm" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <PlusCircleIcon className="w-5 h-5 rotate-45" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-10">
        {allActivities.length > 0 ? (
          visibleActivities.length > 0 ? (
            visibleActivities.map(activity => (
              <ActivityCard 
                key={`${activeTab}-${activity.id}`} 
                activity={activity} 
                onFollowToggle={handleFollowToggle}
                onStartConversation={onStartConversation}
                onNavigate={onNavigate}
                isAuthenticated={isAuthenticated}
                onRequestAuth={onRequestAuth}
                userInterests={userInterests}
              />
            ))
          ) : (
            <div className="text-center py-20 px-6 animate-fade-in-up">
              <div className="text-5xl mb-4">🏜️</div>
              <p className="text-gray-900 font-extrabold text-lg">Quiet out here...</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or follow more people.</p>
              {activeTab === 'Following' && (
                <button 
                   onClick={() => setActiveTab('Trending')}
                   className="mt-6 text-teal-600 font-bold text-sm bg-teal-50 px-6 py-2 rounded-full"
                >
                    Discover Trends
                </button>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-10 px-6">
            <h3 className="text-lg font-semibold text-gray-700">Oops! No one's dunda-ing here yet.</h3>
            <p className="text-gray-500 mt-2">Be the first to show up.</p>
            <button
              onClick={() => isAuthenticated ? onNavigate('createPost') : onRequestAuth()}
              className="mt-4 inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2 -ml-1"/>
              List an Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryPage;
