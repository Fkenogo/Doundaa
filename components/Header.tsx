import React from 'react';
import { BellIcon, UserIcon } from './icons';

interface HeaderProps {
    onLogoClick: () => void;
    onProfileClick: () => void;
    hasNotifications: boolean;
    avatarUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onProfileClick, hasNotifications, avatarUrl }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={onLogoClick} className="cursor-pointer">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Doundaa
            </h1>
          </button>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-800 relative">
              <BellIcon className="w-6 h-6" />
              {hasNotifications && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
            <button onClick={onProfileClick} className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                    <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover"/>
                ) : (
                    <UserIcon className="w-6 h-6 text-gray-500" />
                )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;