
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
    <header className="sticky top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-b border-white/5 z-50 pt-safe-top shrink-0">
      <div className="w-full px-5">
        <div className="flex items-center justify-between h-16">
          <button onClick={onLogoClick} className="cursor-pointer active:scale-95 transition-transform">
            <h1 className="text-2xl font-black text-white tracking-tighter">
              Doundaa
            </h1>
          </button>
          <div className="flex items-center space-x-3">
            <button className="text-slate-400 hover:text-white relative p-2 active:scale-90 transition-transform">
              <BellIcon className="w-6 h-6" />
              {hasNotifications && (
                <span className="absolute top-2 right-2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
            <button 
              onClick={onProfileClick} 
              className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-700 shadow-sm active:scale-90 transition-transform"
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover"/>
                ) : (
                    <UserIcon className="w-6 h-6 text-slate-400" />
                )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
