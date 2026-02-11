
import React, { useState, useMemo } from 'react';
import { mockActivities, mockActivitiesTrending, mockPopularActivities } from '../../constants';
import ActivityCard from '../ActivityCard';
import FilterBar from '../FilterBar';
import { Activity, Page, Provider, User } from '../../types';
import { PlusCircleIcon, SparklesIcon } from '../icons';
import { ALGORITHM_WEIGHTS } from '../../algorithmConfig';

interface DiscoveryPageProps {
  onNavigate: (page: Page, profileUser?: User | Provider) => void;
  onStartConversation: (provider: Provider) => void;
  isAuthenticated: boolean;
  onRequestAuth: () => void;
  userInterests: string[];
  currentUser: User | null;
}

const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ onNavigate, onStartConversation, isAuthenticated, onRequestAuth, userInterests, currentUser }) => {
  const [activeTab, setActiveTab] = useState('For You');
  const [searchQuery, setSearchQuery] = useState('');

  const allActivities = useMemo(() => mockActivities, []);
  
  const getActivityScore = (activity: Activity, searchMode: boolean = false): number => {
    let score = 0;
    const weights = ALGORITHM_WEIGHTS.feedRanking;
    const userInterestSet = new Set(userInterests);

    const directMatches = activity.interestIds.filter(id => userInterestSet.has(id)).length;
    score += directMatches * weights.interest_match_weight * 100;
    score += (100 / (1 + Math.log10(1 + activity.distance))) * weights.proximity_weight;
    score += (activity.provider.rating / 5) * weights.quality_weight * 50;

    if (searchMode && searchQuery) {
        const query = searchQuery.toLowerCase();
        if (activity.title.toLowerCase().includes(query)) score += 500;
        if (activity.description?.toLowerCase().includes(query)) score += 200;
    }
    return score;
  };

  const sortedForYouActivities = useMemo(() => {
    return allActivities
        .map(activity => ({ activity, score: getActivityScore(activity) }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.activity);
  }, [allActivities, userInterests]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return allActivities
        .filter(a => a.title.toLowerCase().includes(query) || a.location.name.toLowerCase().includes(query))
        .map(activity => ({ activity, score: getActivityScore(activity, true) }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.activity);
  }, [searchQuery, allActivities]);

  const visibleActivities = searchResults || (activeTab === 'For You' ? sortedForYouActivities : allActivities);

  return (
    <div className="max-w-md mx-auto min-h-full">
      <FilterBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* High-Contrast Dark Search Area */}
      <div className="p-8 bg-slate-950 border-b border-white/5">
        <div className="flex items-center space-x-2.5 mb-2">
            <div className="bg-teal-500/10 p-1.5 rounded-lg">
                <SparklesIcon className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[3px] text-teal-400">Discover Rwanda</span>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight leading-tight mb-8">
          Find your next <br/><span className="text-teal-400">adventure</span>.
        </h2>
        
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Vibes, spots, activities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border-2 border-slate-800 rounded-[24px] py-5 pl-14 pr-12 focus-ring text-base font-bold text-white placeholder:text-slate-600 shadow-xl" 
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-teal-400 transition-colors">
            <PlusCircleIcon className="w-6 h-6 rotate-45" />
          </div>
        </div>
      </div>

      <div className="px-6 py-10 space-y-8">
        {visibleActivities.length > 0 ? visibleActivities.map(activity => (
          <ActivityCard 
            key={activity.id} 
            activity={activity} 
            onFollowToggle={() => {}}
            onStartConversation={onStartConversation}
            onNavigate={onNavigate}
            isAuthenticated={isAuthenticated}
            onRequestAuth={onRequestAuth}
            userInterests={userInterests}
          />
        )) : (
          <div className="py-24 text-center space-y-4">
              <div className="text-6xl mb-6">🏝️</div>
              <p className="text-xl font-black text-white">No results found</p>
              <p className="text-slate-500 font-medium">Try searching for something else or explore "Trending".</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 bg-teal-600 text-white font-black px-10 py-4 rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl shadow-teal-600/20"
              >
                Reset Search
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryPage;
