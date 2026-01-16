
import React, { useState, useMemo, useRef } from 'react';
import { User, Page, Provider } from '../../types';
import { ALL_INTERESTS_MAP, MAIN_CATEGORIES } from '../../interests';
import { SettingsIcon, SparklesIcon, CalendarIcon, CameraIcon, ChevronLeftIcon, HeartIcon, ChevronRightIcon, MessageCircleIcon } from '../icons';
import InterestTag from '../InterestTag';

interface ProfilePageProps {
    user: User | Provider;
    isOwnProfile: boolean;
    onNavigate: (page: Page, profileUser?: User | Provider) => void;
    onUpdateProfile: (data: { name: string, bio: string, avatarUrl: string }) => void;
    onStartConversation: (user: User | Provider) => void;
}

const dateLabels: { [key: string]: string } = {
    'weekday-evening': 'Weekday Evenings',
    'weekend-day': 'Weekend Days',
    'weekend-evening': 'Weekend Evenings',
    'any': 'Any Time',
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, isOwnProfile, onNavigate, onUpdateProfile, onStartConversation }) => {
    const [isInterestsExpanded, setIsInterestsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Convert to User type for logic consistency if it's a Provider
    const userToView = user as User;

    // Edit Form State
    const [editName, setEditName] = useState(userToView.name);
    const [editBio, setEditBio] = useState(userToView.bio || '');
    const [editAvatar, setEditAvatar] = useState(userToView.avatarUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userInterests = useMemo(() => {
        return (userToView.interestIds || [])
            .map(id => ALL_INTERESTS_MAP.get(id))
            .filter((i): i is NonNullable<typeof i> => i !== undefined);
    }, [userToView.interestIds]);

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

    const handleSaveProfile = () => {
        onUpdateProfile({
            name: editName,
            bio: editBio,
            avatarUrl: editAvatar
        });
        setIsEditing(false);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setEditAvatar(url);
        }
    };

    // --- EDITOR VIEW ---
    if (isEditing && isOwnProfile) {
        return (
            <div className="fixed inset-0 bg-white z-[70] flex flex-col animate-fade-in-up">
                <header className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-50 bg-white/80 backdrop-blur-lg sticky top-0 z-10">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-900"
                    >
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    <h1 className="text-xl font-black text-gray-900">Edit Profile</h1>
                    <button 
                        onClick={handleSaveProfile}
                        disabled={!editName.trim()}
                        className="bg-teal-600 text-white font-black px-6 py-2.5 rounded-2xl shadow-xl active:scale-95 transition-all text-sm disabled:opacity-50"
                    >
                        Save
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 no-scrollbar">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group cursor-pointer"
                        >
                            <img src={editAvatar} alt="Avatar Preview" className="w-32 h-32 rounded-[40px] border-4 border-gray-50 shadow-2xl object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 rounded-[40px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <CameraIcon className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-teal-500 p-2.5 rounded-[18px] border-4 border-white shadow-lg text-white">
                                <CameraIcon className="w-5 h-5" />
                            </div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleAvatarChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Tap to change photo</p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                                type="text" 
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-lg font-bold" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                            <div className="relative">
                                <textarea 
                                    value={editBio}
                                    onChange={e => setEditBio(e.target.value)}
                                    maxLength={150}
                                    rows={4}
                                    placeholder="Tell the community who you are..."
                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-base font-medium resize-none"
                                ></textarea>
                                <div className="absolute bottom-4 right-5 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                    {editBio.length}/150
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW MODE ---
    return (
        <div className="max-w-md mx-auto p-4 animate-fade-in-up">
            <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-gray-50 relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10 opacity-50"></div>

                <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center space-x-2">
                        {!isOwnProfile && (
                            <button 
                                onClick={() => onNavigate('discover')}
                                className="p-2 -ml-4 text-gray-400 hover:text-gray-900"
                            >
                                <ChevronLeftIcon className="w-8 h-8" />
                            </button>
                        )}
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{isOwnProfile ? 'Your Profile' : 'Profile'}</h2>
                     </div>
                     {isOwnProfile && (
                         <button 
                            onClick={() => setIsEditing(true)}
                            className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-teal-600 hover:bg-teal-50 transition-all"
                        >
                            <SettingsIcon className="w-6 h-6"/>
                         </button>
                     )}
                </div>
               
                <div className="flex flex-col items-center mt-10 relative z-10">
                    <img src={userToView.avatarUrl} alt={userToView.name} className="w-32 h-32 rounded-[40px] border-4 border-white shadow-2xl object-cover" />
                    <h1 className="text-2xl font-black text-gray-900 mt-6 tracking-tight">{userToView.name}</h1>
                    <p className="text-sm font-bold text-teal-600">@{userToView.username || userToView.name.replace(/\s+/g, '').toLowerCase()}</p>
                    {userToView.bio && (
                        <p className="mt-4 text-center text-gray-500 font-medium leading-relaxed px-4">
                            {userToView.bio}
                        </p>
                    )}
                    
                    <div className="flex flex-col w-full mt-8 space-y-3">
                        {isOwnProfile ? (
                            <>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="w-full bg-gray-900 text-white py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                                >
                                    Edit Profile
                                </button>
                                <button 
                                    onClick={() => onNavigate('interests')}
                                    className="w-full bg-teal-50 text-teal-700 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 border border-teal-100/50 hover:bg-teal-100 transition-all active:scale-95"
                                >
                                    <HeartIcon className="w-4 h-4 fill-current" />
                                    <span>Refine Your Interests</span>
                                    <ChevronRightIcon className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex space-x-3 w-full">
                                <button 
                                    className="flex-1 bg-teal-600 text-white py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-teal-600/20 active:scale-95 transition-all"
                                >
                                    Follow
                                </button>
                                <button 
                                    onClick={() => onStartConversation(user)}
                                    className="flex-1 bg-gray-900 text-white py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-gray-900/10 active:scale-95 transition-all"
                                >
                                    <MessageCircleIcon className="w-4 h-4" />
                                    <span>Message</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-50 pt-8 space-y-6 relative z-10">
                    <div className="flex items-start">
                        <div className="bg-teal-50 p-2.5 rounded-xl mr-4 flex-shrink-0">
                            <SparklesIcon className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discovery Mode</p>
                            <p className="text-sm font-bold text-gray-800 mt-0.5">
                                {userToView.discoveryMode === 'no' 
                                    ? "Sticking to my interests" 
                                    : "Show me surprising new things"}
                            </p>
                        </div>
                    </div>
                    {userToView.preferredDates && userToView.preferredDates.length > 0 && (
                        <div className="flex items-start">
                            <div className="bg-blue-50 p-2.5 rounded-xl mr-4 flex-shrink-0">
                                <CalendarIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Doundaa Availability</p>
                                <p className="text-sm font-bold text-gray-800 mt-0.5">
                                    {userToView.preferredDates.map(d => dateLabels[d] || d).join(', ')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="mt-10 pt-8 border-t border-gray-50 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[2px]">Interests ({userToView.interestIds?.length || 0})</h3>
                    </div>
                    {isInterestsExpanded ? (
                        <div className="space-y-6">
                            {groupedInterests.map(([category, interests]) => (
                                <div key={category} className="space-y-3">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                        <span className="mr-2">{category}</span>
                                        <div className="h-[1px] flex-1 bg-gray-100"></div>
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {interests.map(interest => (
                                            <InterestTag key={interest.id} interest={interest} variant="pill" isSelected={false} onClick={() => {}} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button 
                                onClick={() => setIsInterestsExpanded(false)} 
                                className="w-full py-4 text-xs font-black text-teal-600 uppercase tracking-widest hover:bg-teal-50 rounded-2xl transition-all"
                            >
                                Show less
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-wrap gap-2">
                                {topInterests.map(interest => (
                                     <InterestTag key={interest.id} interest={interest} variant="pill" isSelected={false} onClick={() => {}} />
                                ))}
                            </div>
                            {remainingCount > 0 && (
                                <button 
                                    onClick={() => setIsInterestsExpanded(true)} 
                                    className="w-full mt-4 py-4 text-xs font-black text-teal-600 uppercase tracking-widest bg-gray-50 hover:bg-teal-50 rounded-2xl transition-all"
                                >
                                    + {remainingCount} more interests
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {isOwnProfile && (
                    <div className="mt-12 border-t border-gray-50 pt-6">
                        <button 
                            onClick={() => onNavigate('admin')} 
                            className="text-[10px] font-black text-gray-300 uppercase tracking-[3px] hover:text-teal-600 w-full text-center transition-colors"
                        >
                            Access Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
