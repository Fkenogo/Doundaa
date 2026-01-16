import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { MAIN_CATEGORIES, DETAILED_INTERESTS, Interest, MainCategory } from '../../interests';
import { User } from '../../types';
import { CameraIcon, CheckCircleIcon, MapPinIcon, BellIcon, SparklesIcon, ChevronLeftIcon } from '../icons';
import InterestTag from '../InterestTag';

interface ProfileData {
    name: string;
    username: string;
    avatarUrl: string;
    bio: string;
}

export interface OnboardingData {
    profile: ProfileData;
    interests: string[];
    discoveryMode: 'yes' | 'no';
    permissions: {
        location: 'granted' | 'denied' | 'idle';
        notifications: 'granted' | 'denied' | 'idle';
    }
}

interface OnboardingPageProps {
  onOnboardingComplete: (data: OnboardingData) => void;
  initialUser: User | null;
}

const TOTAL_STEPS = 7;

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onOnboardingComplete, initialUser }) => {
  const [step, setStep] = useState(1);
  
  // Data states
  const [profile, setProfile] = useState<ProfileData>({ 
      name: initialUser?.name || '', 
      username: initialUser?.username || '',
      avatarUrl: initialUser?.avatarUrl || '',
      bio: initialUser?.bio || '' 
  });
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [discoveryMode, setDiscoveryMode] = useState<'yes' | 'no'>('yes');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'idle'>('idle');
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'idle'>('idle');
  
  // UI States
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameTouched, setUsernameTouched] = useState(false);

  // Username validation simulation
  useEffect(() => {
    if (!usernameTouched || profile.username.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    const handler = setTimeout(() => {
      // Simulate API call
      if (['admin', 'doundaa', 'test'].includes(profile.username.toLowerCase())) {
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('available');
      }
    }, 800);

    return () => clearTimeout(handler);
  }, [profile.username, usernameTouched]);

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    if(field === 'username') setUsernameTouched(true);
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]){
        const fileUrl = URL.createObjectURL(e.target.files[0]);
        setProfile(prev => ({...prev, avatarUrl: fileUrl}));
    }
  };

  const handleVibeToggle = (vibeId: string) => {
    setSelectedVibes(prev => {
      if (prev.includes(vibeId)) return prev.filter(id => id !== vibeId);
      if (prev.length < 3) return [...prev, vibeId];
      return prev;
    });
  };
  
  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const requestLocation = () => {
      navigator.geolocation.getCurrentPosition(
          () => { setLocationPermission('granted'); handleNext(); },
          () => { setLocationPermission('denied'); handleNext(); }
      );
  };

  const requestNotifications = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setNotificationPermission('granted');
        } else {
            setNotificationPermission('denied');
        }
    } catch (error) {
        console.error("Notification permission error:", error);
        setNotificationPermission('denied');
    } finally {
        handleNext();
    }
  };
  
  const isNextDisabled = useCallback(() => {
      switch(step) {
          case 1: return !profile.name || profile.username.length < 3 || usernameStatus === 'taken' || usernameStatus === 'checking';
          case 2: return selectedVibes.length < 1;
          case 3: return selectedInterests.length < 5;
          default: return false;
      }
  }, [step, profile, usernameStatus, selectedVibes, selectedInterests]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    } else {
      onOnboardingComplete({
        profile,
        interests: selectedInterests,
        discoveryMode,
        permissions: {
            location: locationPermission,
            notifications: notificationPermission,
        }
      });
    }
  };
  
  const handleBack = () => {
      if (step > 1) setStep(s => s - 1);
  }

  const renderStepContent = () => {
    switch(step) {
        case 1: return <ProfileStep data={profile} onChange={handleProfileChange} onAvatarUpload={handleAvatarUpload} usernameStatus={usernameStatus} />;
        case 2: return <VibeStep selected={selectedVibes} onToggle={handleVibeToggle} />;
        case 3: return <InterestStep selectedInterests={selectedInterests} onToggle={handleInterestToggle} />;
        case 4: return <DiscoveryStep mode={discoveryMode} setMode={setDiscoveryMode} />;
        case 5: return <LocationStep onRequest={requestLocation} onSkip={handleNext} />;
        case 6: return <NotificationStep onRequest={requestNotifications} onSkip={handleNext} />;
        case 7: return <SuccessStep />;
        default: return null;
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white max-w-md mx-auto relative overflow-hidden">
      <div className="p-safe-top" />
      <header className={`px-6 py-4 flex flex-col space-y-4 ${step === 3 ? 'pb-2 border-b border-gray-50' : ''}`}>
         <div className="flex items-center justify-between">
            {step > 1 ? (
                <button onClick={handleBack} className="text-gray-900 p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
                    <ChevronLeftIcon className="w-8 h-8" />
                </button>
            ) : <div className="w-12 h-12" />}
            <div className="flex-1 flex justify-center">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Step {step} / {TOTAL_STEPS}</span>
            </div>
            {step < 5 ? (
                <button onClick={handleNext} className="text-sm font-bold text-teal-600 active:opacity-60 px-2 py-1">Skip</button>
            ) : <div className="w-10 h-10" />}
         </div>
         <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-500 h-full transition-all duration-700 ease-in-out" style={{width: `${(step/TOTAL_STEPS)*100}%`}}></div>
        </div>
      </header>
      
      <main className={`flex-1 overflow-y-auto no-scrollbar ${step === 3 ? 'pt-0' : 'px-6 pt-2 pb-10'}`}>
        <div className={`mx-auto ${step === 3 ? 'max-w-full' : 'max-w-sm'}`}>
            {renderStepContent()}
        </div>
      </main>

      <footer className="px-6 py-6 pb-10 bg-white border-t border-gray-50 p-safe-bottom z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col space-y-4">
            {step < 5 && (
                 <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900">
                             {step === 3 ? `${selectedInterests.length} selected` : step === 2 ? `${selectedVibes.length}/3 selected` : ''}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            {step === 3 && selectedInterests.length < 5 ? `Select ${5 - selectedInterests.length} more` : ''}
                            {step === 2 && selectedVibes.length === 0 ? 'Pick at least one' : ''}
                        </span>
                    </div>
                     <button 
                        onClick={handleNext} 
                        disabled={isNextDisabled()}
                        className="bg-teal-600 text-white font-black py-4 px-10 rounded-[20px] active:scale-95 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed transition-all shadow-xl shadow-teal-600/20 text-lg"
                    >
                       Continue
                    </button>
                </div>
            )}
             {step >= 5 && step < TOTAL_STEPS && (
                 <div className="w-full text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">You can update these later in Settings</p>
                 </div>
             )}
             {step === TOTAL_STEPS && (
                  <button onClick={handleNext} className="w-full bg-[#14b8a6] text-white font-black py-5 px-6 rounded-[24px] active:scale-95 transition-all shadow-xl shadow-teal-900/20 text-lg">
                       Start Exploring →
                  </button>
             )}
        </div>
      </footer>
    </div>
  );
};

// Step Components
const ProfileStep = ({ data, onChange, onAvatarUpload, usernameStatus }: any) => (
    <div className="space-y-10 animate-fade-in-up py-4">
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-gray-900 leading-tight">Create Profile</h2>
            <p className="text-base font-medium text-gray-500">Let the community know it's you</p>
        </div>
        <div className="flex justify-center">
            <label htmlFor="avatar-upload" className="cursor-pointer group relative">
                <div className="w-32 h-32 rounded-[40px] bg-gray-50 flex items-center justify-center text-gray-400 overflow-hidden border-4 border-white shadow-2xl transition-transform group-active:scale-95">
                    {data.avatarUrl ? <img src={data.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : <CameraIcon className="w-12 h-12 opacity-30" />}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-teal-500 p-2.5 rounded-[18px] border-4 border-white shadow-lg text-white">
                    <CameraIcon className="w-6 h-6" />
                </div>
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={onAvatarUpload} />
            </label>
        </div>
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" placeholder="e.g. Jean Paul" value={data.name} onChange={e => onChange('name', e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-lg font-bold placeholder:text-gray-300" />
            </div>
            <div className="space-y-2">
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                 <div className="relative">
                    <input type="text" placeholder="unique_name" value={data.username} onChange={e => onChange('username', e.target.value)} className={`w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-lg font-bold pr-24 placeholder:text-gray-300 ${usernameStatus === 'taken' ? 'bg-red-50' : ''}`} />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        {usernameStatus === 'checking' && <span className="text-xs font-bold text-gray-300 animate-pulse">Checking...</span>}
                        {usernameStatus === 'available' && <span className="text-xs font-black text-green-500">Available</span>}
                        {usernameStatus === 'taken' && <span className="text-xs font-black text-red-500">Taken</span>}
                    </div>
                 </div>
            </div>
            <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Bio</label>
                <textarea placeholder="Coffee lover, hiker, and looking for good vibes..." value={data.bio} onChange={e => onChange('bio', e.target.value)} maxLength={150} className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all text-base font-medium resize-none placeholder:text-gray-300" rows={3}></textarea>
            </div>
        </div>
    </div>
);

const VibeStep = ({ selected, onToggle }: { selected: string[], onToggle: (id: string) => void }) => {
    // Alphabetical sort for consistency
    const sortedCategories = useMemo(() => {
        return [...MAIN_CATEGORIES].sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    return (
        <div className="space-y-8 animate-fade-in-up py-4">
            <div className="text-center space-y-2 px-2">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">Pick Your Vibe</h2>
                <p className="text-base font-medium text-gray-500">Choose up to 3 that match your energy</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pb-10">
                {sortedCategories.map(vibe => (
                    <InterestTag 
                        key={vibe.id}
                        interest={{ id: vibe.id, name: vibe.name, emoji: vibe.emoji, category: vibe.id }}
                        variant="card"
                        isSelected={selected.includes(vibe.id)}
                        onClick={() => onToggle(vibe.id)}
                    />
                ))}
            </div>
        </div>
    );
};

const InterestStep = ({selectedInterests, onToggle} : {selectedInterests: string[], onToggle: (id: string) => void}) => {
    const categories = useMemo(() => [...MAIN_CATEGORIES].sort((a, b) => a.name.localeCompare(b.name)), []);
    const [activeCategoryId, setActiveCategoryId] = useState(categories[0].id);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Group interests by categories for quick filtering
    const interestsByCategory = useMemo(() => {
        const map: { [key: string]: Interest[] } = {};
        DETAILED_INTERESTS.forEach(interest => {
            if (!map[interest.category]) map[interest.category] = [];
            map[interest.category].push(interest);
        });
        return map;
    }, []);

    const activeInterests = useMemo(() => {
        return (interestsByCategory[activeCategoryId] || []).sort((a, b) => a.name.localeCompare(b.name));
    }, [activeCategoryId, interestsByCategory]);

    // Track how many interests selected per category for badges
    const selectionCountPerCategory = useMemo(() => {
        const counts: { [key: string]: number } = {};
        selectedInterests.forEach(id => {
            const interest = DETAILED_INTERESTS.find(i => i.id === id);
            if (interest) {
                counts[interest.category] = (counts[interest.category] || 0) + 1;
            }
        });
        return counts;
    }, [selectedInterests]);

    return (
      <div className="flex flex-col h-full animate-fade-in-up">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-6 space-y-2">
            <h2 className="text-3xl font-black text-gray-900 leading-tight">Your Interests</h2>
            <p className="text-sm font-medium text-gray-500">Pick things you genuinely love to do.</p>
        </div>

        {/* Horizontal Category Filter Strip */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 pt-2 pb-5">
            <div className="flex overflow-x-auto no-scrollbar space-x-3 px-6">
                {categories.map(cat => {
                    const isActive = activeCategoryId === cat.id;
                    const count = selectionCountPerCategory[cat.id] || 0;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategoryId(cat.id)}
                            className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2.5 rounded-[18px] transition-all duration-300 relative ${
                                isActive ? 'bg-gray-900 text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-500 active:bg-gray-100'
                            }`}
                        >
                            <span className="text-lg">{cat.emoji}</span>
                            <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                {cat.name.split(' ')[0]}
                            </span>
                            {count > 0 && (
                                <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm ${isActive ? 'bg-teal-500 text-white' : 'bg-teal-600 text-white'}`}>
                                    {count}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Filtered Interests Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-8" ref={scrollRef}>
            <div key={activeCategoryId} className="space-y-8 animate-fade-in-up">
                <div className="flex items-center space-x-3 opacity-60">
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">
                        {categories.find(c => c.id === activeCategoryId)?.name}
                    </span>
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {activeInterests.map(interest => (
                        <InterestTag
                            key={`${activeCategoryId}-${interest.id}`}
                            interest={interest}
                            variant="pill"
                            isSelected={selectedInterests.includes(interest.id)}
                            onClick={onToggle}
                        />
                    ))}
                </div>

                {/* Quick Navigation Nudge */}
                <div className="pt-12 text-center pb-10">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">Explore More?</p>
                    <button 
                        onClick={() => {
                            const currentIndex = categories.findIndex(c => c.id === activeCategoryId);
                            if (currentIndex < categories.length - 1) {
                                setActiveCategoryId(categories[currentIndex + 1].id);
                                scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                        className="text-teal-600 font-black text-sm px-6 py-3 bg-teal-50 rounded-2xl active:scale-95 transition-transform"
                    >
                        See {categories[(categories.findIndex(c => c.id === activeCategoryId) + 1) % categories.length].name} →
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
};

const DiscoveryStep = ({ mode, setMode }: { mode: 'yes' | 'no', setMode: (m: 'yes' | 'no') => void }) => (
    <div className="text-center space-y-10 animate-fade-in-up py-10">
        <div className="space-y-4">
            <div className="w-24 h-24 bg-teal-50 text-teal-600 rounded-[32px] mx-auto flex items-center justify-center shadow-inner">
                <SparklesIcon className="w-12 h-12" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">Surprise Mode?</h2>
                <p className="text-base font-medium text-gray-500 px-6">Should we show you events slightly outside your comfort zone?</p>
            </div>
        </div>
        <div className="space-y-4 px-2">
            <button 
                onClick={() => setMode('yes')} 
                className={`w-full p-7 border-4 rounded-[28px] text-left transition-all relative group ${mode === 'yes' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-50 bg-gray-50 active:bg-gray-100'}`}
            >
                <div className="flex items-center justify-between mb-2">
                    <p className="font-black text-gray-900 text-xl">Yes, Surprise Me</p>
                    {mode === 'yes' && <CheckCircleIcon className="w-7 h-7 text-teal-600" />}
                </div>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">Discover hidden gems and new passions in Rwanda you didn't know you had.</p>
                <span className="absolute -top-3 right-6 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">Recommended</span>
            </button>
            <button 
                onClick={() => setMode('no')} 
                className={`w-full p-7 border-4 rounded-[28px] text-left transition-all relative ${mode === 'no' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-50 bg-gray-50 active:bg-gray-100'}`}
            >
                <div className="flex items-center justify-between mb-2">
                    <p className="font-black text-gray-900 text-xl">Stick to My Interests</p>
                    {mode === 'no' && <CheckCircleIcon className="w-7 h-7 text-teal-600" />}
                </div>
                <p className="text-sm font-medium text-gray-500 leading-relaxed">I know exactly what I like and I want to keep my feed precise.</p>
            </button>
        </div>
    </div>
);

const LocationStep = ({ onRequest, onSkip }: {onRequest: () => void, onSkip: () => void}) => (
    <div className="text-center space-y-10 animate-fade-in-up py-10 px-2">
        <div className="space-y-4">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] mx-auto flex items-center justify-center">
                <MapPinIcon className="w-12 h-12" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">Nearby Magic</h2>
                <p className="text-base font-medium text-gray-500">Find adventures just down the street</p>
            </div>
        </div>
        <div className="bg-gray-50 p-7 rounded-[32px] space-y-5 text-left">
            <div className="flex items-start space-x-4">
                <div className="p-2 bg-white text-green-500 rounded-[14px] shadow-sm font-black">✓</div>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">Find activities within walking distance in Kigali</p>
            </div>
            <div className="flex items-start space-x-4">
                <div className="p-2 bg-white text-green-500 rounded-[14px] shadow-sm font-black">✓</div>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">Get accurate travel times to venues</p>
            </div>
        </div>
        <div className="space-y-4 pt-6">
            <button onClick={onRequest} className="w-full bg-gray-900 text-white font-black py-5 px-6 rounded-[24px] active:scale-95 transition-all shadow-xl shadow-gray-900/20 text-lg">Allow Access</button>
            <button onClick={onSkip} className="text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 p-2">Skip for now</button>
        </div>
    </div>
);

const NotificationStep = ({ onRequest, onSkip }: {onRequest: () => void, onSkip: () => void}) => (
     <div className="text-center space-y-10 animate-fade-in-up py-10 px-2">
        <div className="space-y-4">
            <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-[32px] mx-auto flex items-center justify-center">
                <BellIcon className="w-12 h-12" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">Stay Connected</h2>
                <p className="text-base font-medium text-gray-500">Know when the magic happens</p>
            </div>
        </div>
        <div className="bg-gray-50 p-7 rounded-[32px] space-y-5 text-left">
            <div className="flex items-start space-x-4">
                <div className="p-2 bg-white text-green-500 rounded-[14px] shadow-sm font-black">✓</div>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">Real-time chat updates with your match crew</p>
            </div>
            <div className="flex items-start space-x-4">
                <div className="p-2 bg-white text-green-500 rounded-[14px] shadow-sm font-black">✓</div>
                <p className="text-sm text-gray-600 font-bold leading-relaxed">Reminders before your doundaa starts</p>
            </div>
        </div>
        <div className="space-y-4 pt-6">
            <button onClick={onRequest} className="w-full bg-teal-600 text-white font-black py-5 px-6 rounded-[24px] active:scale-95 transition-all shadow-xl shadow-teal-600/20 text-lg">Allow Notifications</button>
            <button onClick={onSkip} className="text-sm font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 p-2">Skip</button>
        </div>
    </div>
);

const SuccessStep = () => (
    <div className="text-center space-y-10 animate-fade-in-up py-16 px-4 flex flex-col items-center justify-center h-full">
        <div className="relative">
            <div className="text-9xl animate-bounce">🌍</div>
            <div className="absolute -top-4 -right-4 text-5xl animate-pulse">✨</div>
        </div>
        <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Karibu Doundaa!</h2>
            <p className="text-xl font-semibold text-gray-500">You're ready to show up.</p>
        </div>
        <div className="p-8 bg-teal-50 rounded-[40px] border-4 border-white shadow-xl max-w-xs mx-auto">
            <p className="text-teal-800 font-black text-lg italic leading-relaxed">"Life happens when you show up."</p>
        </div>
    </div>
);


export default OnboardingPage;
