
import React, { useState, useMemo } from 'react';
import { User, Activity, Page, Provider } from '../../types';
import { mockActivitiesForYou, mockUsersInterestedInActivity } from '../../constants';
import { MessageCircleIcon } from '../icons';
import { formMatchGroups, MatchGroup } from '../matchingAlgorithm';

interface MatchesPageProps {
  currentUser: User | null;
  onNavigate: (page: Page, profileUser?: User | Provider) => void;
}

const MatchScoreIndicator: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 18; // 2 * pi * radius
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let colorClass = 'text-green-500';
    if (score < 75) colorClass = 'text-yellow-500';
    if (score < 50) colorClass = 'text-orange-500';

    return (
        <div className={`relative w-12 h-12 font-bold text-lg ${colorClass}`}>
            <svg className="w-full h-full" viewBox="0 0 40 40">
                <circle
                    className="text-gray-200"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="transparent"
                    r="18"
                    cx="20"
                    cy="20"
                />
                <circle
                    className="transform -rotate-90 origin-center transition-all duration-500"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="18"
                    cx="20"
                    cy="20"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {Math.round(score)}%
            </span>
        </div>
    );
};

const MatchGroupCard: React.FC<{ group: MatchGroup, onNavigate: (page: Page, profileUser?: User | Provider) => void }> = ({ group, onNavigate }) => {
    const [chatRequested, setChatRequested] = useState(false);
    const visibleMembers = group.members.slice(0, 5);

    return (
        <div className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex -space-x-3">
                        {visibleMembers.map(member => (
                            <button 
                                key={member.id} 
                                onClick={() => onNavigate('profile', member)}
                                className="w-10 h-10 rounded-full border-2 border-white overflow-hidden active:scale-90 transition-transform"
                            >
                                <img 
                                    src={member.avatarUrl} 
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {group.members.map((m, idx) => (
                            <button 
                                key={m.id} 
                                onClick={() => onNavigate('profile', m)}
                                className="text-sm font-semibold text-gray-800 hover:text-teal-600 transition-colors"
                            >
                                {m.name}{idx < group.members.length - 1 ? ',' : ''}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{group.size}-person crew</p>
                </div>
                <div className="text-center">
                    <MatchScoreIndicator score={group.avgCompatibility} />
                    <p className="text-xs font-semibold text-gray-500 mt-1">Match</p>
                </div>
            </div>
            <button
                onClick={() => setChatRequested(true)}
                disabled={chatRequested}
                className="mt-4 w-full bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
            >
                <MessageCircleIcon className="w-4 h-4" />
                <span>{chatRequested ? 'Requested!' : 'Start Group Chat'}</span>
            </button>
        </div>
    )
}

const MatchesPage: React.FC<MatchesPageProps> = ({ currentUser, onNavigate }) => {
  const [selectedActivity] = useState<Activity>(mockActivitiesForYou[0]);

  const matchGroups = useMemo(() => {
    if (!currentUser) return [];
    // We add the current user to the list of candidates to ensure they are part of the matching pool
    const allInterestedUsers = [currentUser, ...mockUsersInterestedInActivity.filter(u => u.id !== currentUser.id)];
    return formMatchGroups(allInterestedUsers);
  }, [currentUser]);

  if (!currentUser) {
      return (
          <div className="text-center p-8">
              <h2 className="text-xl font-bold">Join to find your Crew!</h2>
              <p className="text-gray-600 mt-2">Log in to discover and match with people for activities you love.</p>
          </div>
      )
  }
  
  const currentUserGroups = matchGroups.filter(g => g.members.some(m => m.id === currentUser.id));

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">Match Results For:</h2>
        <p className="font-semibold text-teal-600 text-lg mt-1">{selectedActivity.title}</p>
      </div>

      {currentUserGroups.length > 0 ? (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700 px-2">Your Suggested Doundaa Crews</h3>
            {currentUserGroups.map((group, index) => (
                <MatchGroupCard key={index} group={group} onNavigate={onNavigate} />
            ))}
        </div>
      ) : (
        <div className="text-center bg-white p-8 rounded-xl shadow-md">
            <p className="font-semibold text-gray-700">No compatible groups found yet.</p>
            <p className="text-sm text-gray-500 mt-2">More users might join soon! Check back later.</p>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
