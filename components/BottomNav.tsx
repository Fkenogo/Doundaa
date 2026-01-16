
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
  <button onClick={() => navigate(page)} className={`relative flex flex-col items-center justify-center w-full pt-2 pb-1 space-y-1 ${activePage === page ? 'text-teal-600' : 'text-gray-500'} hover:text-teal-600 transition-colors`}>
    {hasNotification && (
        <span className="absolute top-1 right-1/2 translate-x-3 flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
    )}
    {icon}
    <span className="text-xs font-medium">{label}</span>
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
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-2">
        <nav className="flex items-center justify-around h-16">
          <NavItem icon={<CompassIcon className="w-6 h-6" />} label="Discover" page="discover" activePage={activePage} navigate={navigate} />
          <NavItem icon={<UsersIcon className="w-6 h-6" />} label="Matches" page="matches" activePage={activePage} navigate={navigate} />
          
          <button 
            onClick={handleCreatePostClick} 
            className="text-teal-600 hover:text-teal-700 bg-white rounded-full p-1 shadow-lg border-2 border-teal-50 animate-float transition-all active:scale-90"
            aria-label="Create Post"
          >
            <PlusCircleIcon className="w-12 h-12" />
          </button>

          <NavItem icon={<MessageCircleIcon className="w-6 h-6" />} label="Messages" page="messages" activePage={activePage} navigate={navigate} hasNotification={hasUnreadMessages} />
          <NavItem icon={<HeartIcon className="w-6 h-6" />} label="Interests" page="interests" activePage={activePage} navigate={navigate} />
        </nav>
      </div>
    </footer>
  );
};

export default BottomNav;