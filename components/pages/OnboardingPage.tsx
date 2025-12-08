import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MAIN_CATEGORIES, DETAILED_INTERESTS, Interest } from '../../interests';
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
    }, 500);

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
      if (prev.length < 10) return [...prev, vibeId];
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
        case 3: return <InterestStep selectedVibes={selectedVibes} selectedInterests={selectedInterests} onToggle={handleInterestToggle} />;
        case 4: return <DiscoveryStep mode={discoveryMode} setMode={setDiscoveryMode} />;
        case 5: return <LocationStep onRequest={requestLocation} onSkip={handleNext} />;
        case 6: return <NotificationStep onRequest={requestNotifications} onSkip={handleNext} />;
        case 7: return <SuccessStep />;
        default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      <header className="p-4 flex items-center justify-between">
         {step > 1 ? (
             <button onClick={handleBack} className="text-gray-600 p-2 rounded-full hover:bg-gray-200">
                <ChevronLeftIcon className="w-6 h-6" />
             </button>
         ) : <div className="w-10 h-10" />}
         <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mx-4">
            <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{width: `${(step/TOTAL_STEPS)*100}%`}}></div>
        </div>
        {step < 5 && <button onClick={handleNext} className="text-sm font-semibold text-teal-600">Skip</button>}
      </header>
      <main className="flex-1 flex flex-col justify-center p-6">
        {renderStepContent()}
      </main>
      <footer className="p-4 border-t bg-white">
        <div className="flex items-center justify-end">
            {step < 5 && (
                 <div className="flex items-center space-x-4">
                    {step === 3 && <span className="text-sm font-medium text-gray-600">{selectedInterests.length} / 5+ selected</span>}
                     <button 
                        onClick={handleNext} 
                        disabled={isNextDisabled()}
                        className="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                       Continue →
                    </button>
                </div>
            )}
             {step >= 5 && step < TOTAL_STEPS && (
                 <div className="w-full">
                    {/* Buttons are inside the step components for this stage */}
                 </div>
             )}
             {step === TOTAL_STEPS && (
                  <button onClick={handleNext} className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors">
                       Let's Doundaa! →
                  </button>
             )}
        </div>
      </footer>
    </div>
  );
};

// Step Components
const ProfileStep = ({ data, onChange, onAvatarUpload, usernameStatus }: {data: ProfileData, onChange: (field: keyof ProfileData, value: string) => void, onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void, usernameStatus: 'idle' | 'checking' | 'available' | 'taken'}) => (
    <div>
        <h2 className="text-2xl font-bold text-center text-gray-800">Let's Set Up Your Profile</h2>
        <div className="flex justify-center my-6">
            <label htmlFor="avatar-upload" className="cursor-pointer relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden border-2 border-dashed border-gray-300">
                    {data.avatarUrl ? <img src={data.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : <CameraIcon className="w-10 h-10" />}
                </div>
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={onAvatarUpload} />
            </label>
        </div>
        <div className="space-y-4">
            <input type="text" placeholder="Name" value={data.name} onChange={e => onChange('name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <div>
                 <div className="relative">
                    <input type="text" placeholder="Username" value={data.username} onChange={e => onChange('username', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    {usernameStatus === 'available' && <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                 </div>
                 {usernameStatus === 'taken' && <p className="text-xs text-red-500 mt-1">Username already taken.</p>}
                 {usernameStatus === 'checking' && <p className="text-xs text-gray-500 mt-1">Checking...</p>}
            </div>
            <textarea placeholder="Bio (optional)" value={data.bio} onChange={e => onChange('bio', e.target.value)} maxLength={150} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" rows={2}></textarea>
        </div>
    </div>
);

const VibeStep = ({ selected, onToggle }: { selected: string[], onToggle: (id: string) => void }) => (
    <div>
        <h2 className="text-2xl font-bold text-center text-gray-800">What's Your Vibe? 🎯</h2>
        <p className="mt-2 text-center text-gray-600">Pick 1-3 main vibes so we know what to show you.</p>
        <div className="mt-8 grid grid-cols-2 gap-4">
            {MAIN_CATEGORIES.map(vibe => (
                <div key={vibe.id} className="aspect-square">
                    <InterestTag 
                        interest={{ id: vibe.id, name: vibe.name, emoji: vibe.emoji, category: vibe.id }}
                        variant="card"
                        isSelected={selected.includes(vibe.id)}
                        onClick={() => onToggle(vibe.id)}
                    />
                </div>
            ))}
        </div>
    </div>
);

const InterestStep = ({selectedVibes, selectedInterests, onToggle} : {selectedVibes: string[], selectedInterests: string[], onToggle: (id: string) => void}) => {
    const interestsByVibe = useMemo(() => {
        return selectedVibes
            .map(vibeId => ({
                vibe: MAIN_CATEGORIES.find(c => c.id === vibeId)!,
                interests: DETAILED_INTERESTS.filter(i => i.category === vibeId)
            }))
            .sort((a, b) => a.vibe.name.localeCompare(b.vibe.name));
    }, [selectedVibes]);

    return (
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-800">Get Specific 🎯</h2>
        <p className="mt-2 text-center text-gray-600">Pick at least 5 interests (the more, the better!)</p>
        <div className="mt-8 h-[50vh] overflow-y-auto pr-2">
            {interestsByVibe.map(({ vibe, interests }) => (
                <div key={vibe.id} className="mb-6">
                    <h3 className="font-bold text-lg text-gray-700 sticky top-0 bg-gray-50 py-2">{vibe.emoji} {vibe.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {interests.map(interest => (
                             <InterestTag
                                key={interest.id}
                                interest={interest}
                                variant="pill"
                                isSelected={selectedInterests.includes(interest.id)}
                                onClick={onToggle}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
};

const DiscoveryStep = ({ mode, setMode }: { mode: 'yes' | 'no', setMode: (m: 'yes' | 'no') => void }) => (
    <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">One More Thing...</h2>
        <p className="mt-2 text-gray-600">Want us to show you activities outside your interests sometimes?</p>
        <SparklesIcon className="w-16 h-16 text-teal-500 mx-auto my-6" />
        <p className="text-sm text-gray-500">You might discover things you didn't know you'd love.</p>
        <div className="mt-8 space-y-4">
            <button onClick={() => setMode('yes')} className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${mode === 'yes' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'}`}>
                <p className="font-semibold text-gray-800">◉ Yes, surprise me</p>
                <p className="text-sm text-teal-700 font-medium ml-6">Recommended</p>
            </button>
            <button onClick={() => setMode('no')} className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${mode === 'no' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'}`}>
                <p className="font-semibold text-gray-800">○ No, stick to my interests only</p>
            </button>
        </div>
    </div>
);

const LocationStep = ({ onRequest, onSkip }: {onRequest: () => void, onSkip: () => void}) => (
    <div className="text-center">
        <MapPinIcon className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Where You Dunda-ing? 📍</h2>
        <p className="mt-2 text-gray-600">Enable location to discover activities near you.</p>
        <ul className="text-sm text-gray-500 mt-4 space-y-1 text-left list-disc list-inside">
            <li>Activities within 50km</li>
            <li>What's happening nearby</li>
            <li>Distance to meeting points</li>
        </ul>
        <p className="text-xs text-gray-400 mt-4">Your exact location is never shared with other users.</p>
        <div className="mt-8 space-y-3">
            <button onClick={onRequest} className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700">Enable Location →</button>
            <button onClick={onSkip} className="text-sm font-semibold text-gray-500 hover:text-gray-700">Not Now</button>
        </div>
    </div>
);

const NotificationStep = ({ onRequest, onSkip }: {onRequest: () => void, onSkip: () => void}) => (
     <div className="text-center">
        <BellIcon className="w-16 h-16 text-teal-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Don't Miss the Doundaa 🔔</h2>
        <p className="mt-2 text-gray-600">Turn on notifications so you know when:</p>
         <ul className="text-sm text-gray-500 mt-4 space-y-1 text-left list-disc list-inside">
            <li>Someone wants to doundaa with you</li>
            <li>Your crew is ready to go</li>
            <li>What's happening this weekend</li>
        </ul>
        <div className="mt-8 space-y-3">
            <button onClick={onRequest} className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700">Turn On Notifications</button>
            <button onClick={onSkip} className="text-sm font-semibold text-gray-500 hover:text-gray-700">Maybe Later</button>
        </div>
    </div>
);

const SuccessStep = () => (
    <div className="text-center">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">You're Ready to Doundaa!</h2>
        <p className="mt-2 text-gray-600">Your feed is personalized based on your interests. Now, let's find your crew and show up to adventures!</p>
    </div>
);


export default OnboardingPage;