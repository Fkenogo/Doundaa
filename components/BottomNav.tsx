
import React from 'react';
import { CompassIcon, HeartIcon, PlusCircleIcon, UsersIcon, MessageCircleIcon } from './icons';
import { Page } from '../types';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    page: Page;
    activePage: Page;
    navigate: (page: Page) => void;
    hasNotification?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, page, activePage, navigate, hasNotification }) => (
  <button 
    onClick={() => navigate(page)} 
    className={`relative flex flex-col items-center justify-center w-full min-h-[56px] py-1 transition-all active:scale-90 ${activePage === page ? 'text-teal-500' : 'text-slate-500'} hover:text-teal-500`}
  >
    {hasNotification && (
        <span className="absolute top-2 right-1/2 translate-x-3 flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-slate-950"></span>
        </span>
    )}
    <div className={`${activePage === page ? 'scale-110' : ''} transition-transform`}>
        {icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-wider mt-1 ${activePage === page ? 'opacity-100' : 'opacity-60'}`}>
        {label}
    </span>
  </button>
);

interface BottomNavProps {
    activePage: Page;
    navigate: (page: Page) => void;
    hasUnreadMessages: boolean;
    isAuthenticated: boolean;
    onRequestAuth: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, navigate, hasUnreadMessages, isAuthenticated, onRequestAuth }) => {
    const handleCreatePostClick = () => {
        if (isAuthenticated) {
            navigate('createPost');
        } else {
            onRequestAuth();
        }
    };
  
  return (
    <footer className="sticky bottom-0 left-0 right-0 bg-slate-950 border-t border-white/5 z-[100] pb-safe-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.5)] shrink-0 overflow-visible">
      <div className="w-full px-2 overflow-visible">
        <nav className="flex items-center justify-around h-16 overflow-visible">
          <NavItem icon={<CompassIcon className="w-6 h-6" />} label="Discover" page="discover" activePage={activePage} navigate={navigate} />
          <NavItem icon={<UsersIcon className="w-6 h-6" />} label="Matches" page="matches" activePage={activePage} navigate={navigate} />
          
          <div className="flex flex-col items-center justify-end h-full w-full relative pb-1">
            <button 
                onClick={handleCreatePostClick} 
                className="absolute -top-7 left-1/2 -translate-x-1/2 text-white bg-teal-600 rounded-2xl p-3.5 shadow-2xl shadow-teal-900/40 transition-all active:scale-90 border-4 border-slate-950 z-[110]"
                aria-label="Create Post"
            >
                <PlusCircleIcon className="w-7 h-7" />
            </button>
            <span className="text-[9px] font-black uppercase tracking-[2px] text-slate-600 mb-1">Doundaa</span>
          </div>

          <NavItem icon={<MessageCircleIcon className="w-6 h-6" />} label="Chat" page="messages" activePage={activePage} navigate={navigate} hasNotification={hasUnreadMessages} />
          <NavItem icon={<HeartIcon className="w-6 h-6" />} label="Vibe" page="interests" activePage={activePage} navigate={navigate} />
        </nav>
      </div>
    </footer>
  );
};

export default BottomNav;
