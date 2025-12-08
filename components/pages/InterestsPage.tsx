import React, { useState, useMemo } from 'react';
import { User, Activity } from '../../types';
import { ALL_INTERESTS_MAP, MAIN_CATEGORIES } from '../../interests';
import { generateInterestRecommendations, generateActivityRecommendations } from '../recommendationEngine';
import { allMockUsers, mockActivities } from '../../constants';
import { SparklesIcon, PlusCircleIcon, CompassIcon, MapPinIcon } from '../icons';
import InterestTag from '../InterestTag';

interface InterestsPageProps {
    currentUser: User | null;
    onUpdateInterests: (newInterestIds: string[]) => void;
}

const RecommendedActivityCard: React.FC<{ activity: Activity, reason: string }> = ({ activity, reason }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex">
        <img src={activity.images[0]} alt={activity.title} className="w-24 h-full object-cover" />
        <div className="p-3 flex flex-col justify-between">
            <div>
                <p className="text-xs font-semibold text-teal-600">{reason}</p>
                <p className="font-bold text-gray-800 text-sm">{activity.title}</p>
                 <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPinIcon className="w-3 h-3 mr-1"/>
                  {activity.location.name}
                </div>
            </div>
            <a href="#" className="text-xs font-bold text-teal-700 hover:underline mt-2 self-start">View Doundaa →</a>
        </div>
    </div>
);


const InterestsPage: React.FC<InterestsPageProps> = ({ currentUser, onUpdateInterests }) => {
    const [addedInterests, setAddedInterests] = useState<string[]>([]);
    
    const recommendedInterests = useMemo(() => {
        if (!currentUser) return [];
        return generateInterestRecommendations(currentUser, allMockUsers, mockActivities);
    }, [currentUser]);

    const recommendedActivities = useMemo(() => {
        if (!currentUser) return [];
        return generateActivityRecommendations(currentUser, mockActivities, allMockUsers);
    }, [currentUser]);

    const handleAddInterest = (interestId: string) => {
        setAddedInterests(prev => [...prev, interestId]);
        onUpdateInterests([interestId]);
    };

    const userInterests = useMemo(() => {
        return (currentUser?.interestIds || [])
            .map(id => ALL_INTERESTS_MAP.get(id))
            .filter((i): i is NonNullable<typeof i> => i !== undefined);
    }, [currentUser]);

    const groupedInterests = useMemo(() => {
        const groups: { [key: string]: typeof userInterests } = {};
        for (const interest of userInterests) {
            const category = MAIN_CATEGORIES.find(c => c.id === interest.category);
            const categoryName = category ? `${category.emoji} ${category.name}` : 'Other';
            if (!groups[categoryName]) groups[categoryName] = [];
            groups[categoryName].push(interest);
        }
        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }, [userInterests]);

    if (!currentUser) {
      return (
          <div className="text-center p-8">
              <h2 className="text-xl font-bold">Log in to manage your interests!</h2>
              <p className="text-gray-600 mt-2">Personalize your feed and get better matches.</p>
          </div>
      )
    }

    return (
        <div className="max-w-md mx-auto p-4 space-y-8">
            {/* Recommended Interests */}
            <section>
                <div className="flex items-center space-x-2">
                    <SparklesIcon className="w-6 h-6 text-teal-500" />
                    <h2 className="text-xl font-bold text-gray-800">Recommended For You</h2>
                </div>
                 <p className="text-sm text-gray-500 mt-1 mb-4">Discover new passions based on your activity and similar doundaas.</p>
                <div className="space-y-3">
                    {recommendedInterests.slice(0, 5).map(rec => {
                        const interest = ALL_INTERESTS_MAP.get(rec.interestId);
                        if (!interest) return null;
                        const isAdded = addedInterests.includes(interest.id) || currentUser.interestIds?.includes(interest.id);
                        return (
                             <div key={interest.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{interest.emoji} {interest.name}</p>
                                    <p className="text-xs text-gray-500">{rec.reason}</p>
                                </div>
                                <button
                                    onClick={() => handleAddInterest(interest.id)}
                                    disabled={isAdded}
                                    className="text-sm font-bold py-1 px-3 rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-500 bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center space-x-1.5"
                                >
                                    <PlusCircleIcon className="w-4 h-4" />
                                    <span>{isAdded ? 'Added' : 'Add'}</span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </section>
            
            {/* Recommended Activities */}
             <section>
                <div className="flex items-center space-x-2">
                    <CompassIcon className="w-6 h-6 text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-800">Activities You Might Like</h2>
                </div>
                 <p className="text-sm text-gray-500 mt-1 mb-4">Check out these doundaas you haven't seen yet.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {recommendedActivities.slice(0, 4).map(rec => (
                        <RecommendedActivityCard key={rec.activity.id} activity={rec.activity} reason={rec.reason} />
                     ))}
                </div>
            </section>

            {/* Current Interests */}
            <section>
                 <h2 className="text-xl font-bold text-gray-800 mb-4">Your Current Interests</h2>
                 <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    {groupedInterests.map(([category, interests]) => (
                        <div key={category}>
                            <h4 className="font-semibold text-gray-700">{category}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {interests.map(interest => (
                                    <InterestTag key={interest.id} interest={interest} variant="pill" isSelected={false} onClick={() => {}} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default InterestsPage;