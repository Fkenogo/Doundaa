import React, { useState, useMemo } from 'react';
import { User, Page } from '../../types';
import { ALL_INTERESTS_MAP, MAIN_CATEGORIES } from '../../interests';
import { SettingsIcon, SparklesIcon, CalendarIcon } from '../icons';
import InterestTag from '../InterestTag';

interface ProfilePageProps {
    user: User;
    onNavigate: (page: Page) => void;
}

const dateLabels: { [key: string]: string } = {
    'weekday-evening': 'Weekday Evenings',
    'weekend-day': 'Weekend Days',
    'weekend-evening': 'Weekend Evenings',
    'any': 'Any Time',
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onNavigate }) => {
    const [isInterestsExpanded, setIsInterestsExpanded] = useState(false);

    const userInterests = useMemo(() => {
        return (user.interestIds || [])
            .map(id => ALL_INTERESTS_MAP.get(id))
            .filter((i): i is NonNullable<typeof i> => i !== undefined);
    }, [user.interestIds]);

    const groupedInterests = useMemo(() => {
        const groups: { [key: string]: typeof userInterests } = {};
        for (const interest of userInterests) {
            const category = MAIN_CATEGORIES.find(c => c.id === interest.category);
            const categoryName = category ? `${category.emoji} ${category.name}` : 'Other';
            if (!groups[categoryName]) {
                groups[categoryName] = [];
            }
            groups[categoryName].push(interest);
        }
        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    }, [userInterests]);

    const topInterests = userInterests.slice(0, 6);
    const remainingCount = userInterests.length - topInterests.length;

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
                     <button className="text-gray-500 hover:text-gray-800">
                        <SettingsIcon className="w-6 h-6"/>
                     </button>
                </div>
               
                <div className="flex flex-col items-center mt-6">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
                    <h1 className="text-xl font-bold text-gray-900 mt-3">{user.name}</h1>
                    <p className="text-sm text-gray-500">@{user.username || user.name.replace(/\s+/g, '').toLowerCase()}</p>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6 space-y-4">
                    <div className="flex items-start">
                        <SparklesIcon className="w-5 h-5 text-teal-500 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-700 text-sm">Discovery Mode</p>
                            <p className="text-sm text-gray-500">
                                {user.discoveryMode === 'no' 
                                    ? "Off (Sticking to my interests)" 
                                    : "On (Show me surprising new things)"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <CalendarIcon className="w-5 h-5 text-teal-500 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-700 text-sm">Preferred Doundaa Times</p>
                            <p className="text-sm text-gray-500">
                                {(user.preferredDates && user.preferredDates.length > 0)
                                    ? user.preferredDates.map(d => dateLabels[d] || d).join(', ')
                                    : "Not specified"}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Your Interests</h3>
                    {isInterestsExpanded ? (
                        <div className="space-y-4">
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
                            <button onClick={() => setIsInterestsExpanded(false)} className="text-sm font-semibold text-teal-600 hover:underline mt-2">Show less</button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-wrap gap-2">
                                {topInterests.map(interest => (
                                     <InterestTag key={interest.id} interest={interest} variant="pill" isSelected={false} onClick={() => {}} />
                                ))}
                            </div>
                            {remainingCount > 0 && (
                                <button onClick={() => setIsInterestsExpanded(true)} className="text-sm font-semibold text-teal-600 hover:underline mt-2">
                                    + {remainingCount} more interests
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 border-t pt-4">
                    <button onClick={() => onNavigate('admin')} className="text-sm font-medium text-gray-500 hover:text-teal-600 w-full text-left">
                        Admin Dashboard
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;