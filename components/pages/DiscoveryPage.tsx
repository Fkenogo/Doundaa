import React, { useState, useMemo } from 'react';
import { mockActivities, mockActivitiesTrending, mockPopularActivities } from '../../constants';
import ActivityCard from '../ActivityCard';
import FilterBar from '../FilterBar';
import { Activity, Page, Provider, User } from '../../types';
import { PlusCircleIcon } from '../icons';
import { INTEREST_TO_CLUSTER_MAP, ADJACENT_INTERESTS } from '../../interestClusters';
import { ALGORITHM_WEIGHTS } from '../../algorithmConfig';

interface DiscoveryPageProps {
  onNavigate: (page: Page, state?: object) => void;
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
          ? { ...activity, provider: { ...activity, provider: { ...activity.provider, following: isFollowing } } } 
          : activity
      );

    setActivities(prev => ({
        forYou: updateActivities(prev.forYou),
        nearby: updateActivities(prev.nearby),
        trending: updateActivities(prev.trending),
        happeningNow: updateActivities(prev.happeningNow),
    }));
  };
  
  const sortedForYouActivities = useMemo(() => {
    const isNewUser = !currentUser?.activityHistory?.attended || currentUser.activityHistory.attended.length === 0;

    if (isNewUser) {
        if (userInterests.length > 0) {
            const interestMatched = mockActivities
                .filter(a => a.interestIds.some(id => userInterests.includes(id)))
                .sort((a,b) => b.provider.rating - a.provider.rating);
            
            const feed = [
                ...interestMatched.slice(0, 14),
                ...mockActivitiesTrending.slice(0, 6)
            ];
            return shuffleSlightly(feed);
        } else {
            return mockPopularActivities.slice(0, 20);
        }
    }

    const weights = ALGORITHM_WEIGHTS.feedRanking;
    const userInterestSet = new Set(userInterests);
    const userClusters = new Set<string>();
    userInterests.forEach(interestId => {
        const clusters = INTEREST_TO_CLUSTER_MAP.get(interestId);
        if (clusters) clusters.forEach(cluster => userClusters.add(cluster));
    });

    const getActivityScore = (activity: Activity): number => {
        let score = 0;
        const activityInterestSet = new Set(activity.interestIds);

        score += activity.interestIds.filter(id => userInterestSet.has(id)).length * weights.interest_match_weight;

        const activityClusters = new Set<string>();
        activity.interestIds.forEach(id => {
            const clusters = INTEREST_TO_CLUSTER_MAP.get(id);
            if (clusters) clusters.forEach(cluster => activityClusters.add(cluster));
        });
        score += new Set([...userClusters].filter(c => activityClusters.has(c))).size * weights.cluster_match_weight;

        let adjacentMatches = 0;
        userInterests.forEach(userInterestId => {
            const adjacent = ADJACENT_INTERESTS[userInterestId];
            if (adjacent) {
                adjacent.forEach(adjacentInterest => {
                    if (activityInterestSet.has(adjacentInterest.id) && !userInterestSet.has(adjacentInterest.id)) {
                        adjacentMatches++;
                    }
                });
            }
        });
        score += adjacentMatches * weights.adjacent_match_weight;
        
        score += (activity.provider.rating / 5) * weights.quality_weight;

        score += (1 / (1 + Math.log(1 + activity.distance))) * weights.proximity_weight;

        const hoursSinceCreated = (Date.now() - activity.createdAt) / (1000 * 3600);
        if (hoursSinceCreated <= 48) {
            score *= (1 + weights.recency_boost);
        }

        return score;
    };
      
    const sortedActivities = [...activities.forYou]
        .map(activity => ({ activity, score: getActivityScore(activity) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.activity);

    // FIX: Removed fallback `|| 0.15` as the property is now defined in algorithmConfig.ts.
    const discoveryPercentage = ALGORITHM_WEIGHTS.thresholds.discovery_mode_percentage;
    if (currentUser?.discoveryMode !== 'no' && sortedActivities.length > 0) {
        const discoveryCount = Math.floor(sortedActivities.length * discoveryPercentage);
        if (discoveryCount > 0) {
            const sortedActivityIds = new Set(sortedActivities.map(a => a.id));
            const discoveryCandidates = allActivities.filter(a => !sortedActivityIds.has(a.id));
            
            const shuffledCandidates = shuffleSlightly(discoveryCandidates);
            const discoveryItems = shuffledCandidates.slice(0, discoveryCount);
            
            const finalFeed = [];
            let mainIndex = 0;
            let discoveryIndex = 0;
            const discoveryInterval = discoveryItems.length > 0 ? Math.floor(sortedActivities.length / discoveryItems.length) : Infinity;

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

  }, [activities.forYou, userInterests, currentUser, allActivities]);


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
        <h2 className="text-xl font-bold text-gray-800">Looking for where to doundaa</h2>
        <div className="mt-2 relative">
          <input type="text" placeholder="Search activities..." className="w-full bg-white border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:ring-teal-500 focus:border-teal-500" />
        </div>
      </div>
      <div className="px-4">
        {allActivities.length > 0 ? (
          visibleActivities.length > 0 ? (
            visibleActivities.map(activity => (
              <ActivityCard 
                key={`${activeTab}-${activity.id}`} 
                activity={activity} 
                onFollowToggle={handleFollowToggle}
                onStartConversation={onStartConversation}
                isAuthenticated={isAuthenticated}
                onRequestAuth={onRequestAuth}
                userInterests={userInterests}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No doundaas match your criteria.</p>
              {activeTab === 'Following' && <p className="text-gray-400 text-sm mt-2">Follow some providers to see their doundaas here!</p>}
               {activeTab === 'For You' && <p className="text-gray-400 text-sm mt-2">Activities that match your interests will appear here!</p>}
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