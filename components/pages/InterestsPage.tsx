
import React, { useState, useMemo } from 'react';
import { User, Activity } from '../../types';
import { ALL_INTERESTS_MAP, MAIN_CATEGORIES, DETAILED_INTERESTS } from '../../interests';
import { generateActivityRecommendations } from '../recommendationEngine';
// Fix: changed allMockUsers to mockUsers
import { mockUsers, mockActivities } from '../../constants';
import { SparklesIcon, CalendarIcon, ChevronRightIcon, EditIcon, CheckCircleIcon, TrendingUpIcon } from '../icons';
import InterestTag from '../InterestTag';

interface InterestsPageProps {
    currentUser: User | null;
    onUpdateInterests: (newInterestIds: string[]) => void;
}

// Compact, high-fidelity card for activity recommendations
const RecommendedCard: React.FC<{ activity: Activity, reason: string }> = ({ activity, reason }) => (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden flex h-32 active:scale-[0.98] transition-all mb-4 group hover:shadow-md">
        <div className="w-1/3 h-full relative overflow-hidden">
            <img src={activity.images[0]} alt={activity.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/5"></div>
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-between">
            <div className="space-y-1">
                <div className="flex items-center space-x-1">
                   <SparklesIcon className="w-3 h-3 text-teal-500" />
                   <p className="text-[9px] font-black uppercase tracking-wider text-teal-600 line-clamp-1">{reason}</p>
                </div>
                <h4 className="font-black text-gray-900 text-sm leading-tight line-clamp-2">{activity.title}</h4>
                <p className="text-[10px] font-bold text-gray-400">{activity.location.name}</p>
            </div>
            <div className="flex items-center text-xs font-black text-teal-700">
                <span>View Doundaa</span> 
                <ChevronRightIcon className="w-4 h-4 ml-0.5" />
            </div>
        </div>
    </div>
);

const InterestsPage: React.FC<InterestsPageProps> = ({ currentUser, onUpdateInterests }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Filter recommendations to be highly relevant
    const recommendations = useMemo(() => {
        if (!currentUser) return [];
        // Fix: changed allMockUsers to mockUsers
        return generateActivityRecommendations(currentUser, mockActivities, mockUsers);
    }, [currentUser]);

    // Calculate user's primary "Vibe" for the header summary
    const vibeSummary = useMemo(() => {
        if (!currentUser?.interestIds) return "New Explorer";
        const counts: { [key: string]: number } = {};
        currentUser.interestIds.forEach(id => {
            const interest = ALL_INTERESTS_MAP.get(id);
            if (interest) {
                counts[interest.category] = (counts[interest.category] || 0) + 1;
            }
        });
        const topCatId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
        const category = MAIN_CATEGORIES.find(c => c.id === topCatId);
        return category ? category.name : "Versatile Explorer";
    }, [currentUser]);

    const attendedActivities = useMemo(() => {
        if (!currentUser?.activityHistory?.attended) return [];
        return currentUser.activityHistory.attended.map(hist => 
            mockActivities.find(a => a.id === hist.activityId)
        ).filter((a): a is Activity => !!a);
    }, [currentUser]);

    const userInterestIds = useMemo(() => new Set(currentUser?.interestIds || []), [currentUser]);

    const handleToggleInterest = (id: string) => {
        const currentIds = Array.from(userInterestIds);
        const newIds = userInterestIds.has(id)
            ? currentIds.filter(i => i !== id)
            : [...currentIds, id];
        onUpdateInterests(newIds);
    };

    if (!currentUser) return null;

    // EDITOR VIEW: Full screen interest selection
    if (isEditing) {
        return (
            <div className="fixed inset-0 bg-white z-[60] flex flex-col animate-fade-in-up">
                <header className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Refine Your Vibe</h1>
                        <p className="text-sm font-medium text-gray-500">Select what you're into today.</p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-900 text-white font-black px-6 py-2.5 rounded-2xl shadow-xl active:scale-95 transition-all text-sm"
                    >
                        Done
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-6 space-y-12 no-scrollbar pb-32">
                    {MAIN_CATEGORIES.map(category => (
                        <section key={category.id} className="space-y-5">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-gray-50 shadow-sm">
                                    {category.emoji}
                                </div>
                                <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-[2.5px]">{category.name}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {DETAILED_INTERESTS.filter(i => i.category === category.id).map(interest => (
                                    <InterestTag
                                        key={interest.id}
                                        interest={interest}
                                        variant="pill"
                                        isSelected={userInterestIds.has(interest.id)}
                                        onClick={handleToggleInterest}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        );
    }

    // DASHBOARD VIEW: The main content
    return (
        <div className="bg-gray-50 min-h-screen pb-20 animate-fade-in-up">
            <div className="max-w-md mx-auto px-6 pt-8 space-y-12">
                
                {/* 1. Identity Header */}
                <header className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className="bg-teal-100 text-teal-700 p-1.5 rounded-lg">
                            <TrendingUpIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">Your Vibe Profile</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{vibeSummary}</h1>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                        We're currently matching you based on <strong>{currentUser.interestIds?.length || 0}</strong> unique interests.
                    </p>
                </header>

                {/* 2. Manage Interests CTA (Nudge) */}
                <section>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full bg-gray-900 text-white p-6 rounded-[32px] shadow-2xl flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                <EditIcon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-black text-white text-lg leading-tight">Refine Your Interests</h4>
                                <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Update your doundaa squad</p>
                            </div>
                        </div>
                        <ChevronRightIcon className="w-6 h-6 text-white/20 group-hover:translate-x-1 transition-transform relative z-10" />
                        {/* Decorative Vibe Bubbles */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl"></div>
                    </button>
                </section>

                {/* 3. Recommended Activities (Personalized) */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <SparklesIcon className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900">Recommended for You</h2>
                        </div>
                    </div>
                    
                    <div className="animate-fade-in-up">
                        {recommendations.length > 0 ? (
                            recommendations.slice(0, 4).map(rec => (
                                <RecommendedCard 
                                    key={rec.activity.id} 
                                    activity={rec.activity} 
                                    reason={rec.reason} 
                                />
                            ))
                        ) : (
                            <div className="bg-white p-10 rounded-[32px] text-center border-2 border-dashed border-gray-100">
                                <p className="text-sm font-bold text-gray-400 italic">Select more interests to unlock personalized doundaas!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 4. Recent Interests (Activity History) */}
                <section className="space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900">Your Recent Activity</h2>
                    </div>

                    <div className="flex overflow-x-auto pb-4 -mx-2 px-2 space-x-4 no-scrollbar">
                        {attendedActivities.length > 0 ? (
                            attendedActivities.map(activity => (
                                <div key={activity.id} className="min-w-[150px] w-[150px] space-y-3 group cursor-pointer active:scale-95 transition-all">
                                    <div className="aspect-[4/5] rounded-[28px] overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md border border-white">
                                        <img src={activity.images[0]} alt={activity.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="px-1">
                                        <p className="text-[11px] font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors">
                                            {activity.title}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Attended</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full bg-white rounded-[32px] p-10 text-center border border-gray-100 shadow-sm">
                                <div className="text-3xl mb-3">📍</div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No memories yet.</p>
                                <p className="text-[10px] font-medium text-gray-500 mt-2">Doundaa a few events to see your history here.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* 5. Vibe Stats Card (Insight) */}
                <section className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                <CheckCircleIcon className="w-5 h-5 text-teal-200" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[2.5px] text-teal-100">Profile Health</span>
                        </div>
                        <div className="space-y-2">
                             <h3 className="text-2xl font-black leading-tight">Your calibration is 88% perfect.</h3>
                             <p className="text-sm font-medium text-teal-50/70">Keep attending events to sharpen our matching engine.</p>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div className="bg-white h-full w-[88%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        </div>
                    </div>
                    {/* Decorative Abstract Blobs */}
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </section>
            </div>
        </div>
    );
};

export default InterestsPage;
