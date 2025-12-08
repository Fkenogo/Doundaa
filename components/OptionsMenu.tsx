import React from 'react';
import { FlagIcon } from './icons';

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ isOpen, onClose, onReport }) => {
  if (!isOpen) return null;

  return (
    <>
        {/* Backdrop to close menu on outside click */}
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <div 
            className="absolute top-8 right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
        >
        <button
            onClick={onReport}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
        >
            <FlagIcon className="w-4 h-4 mr-3" />
            Report Doundaa
        </button>
        {/* Future options can be added here */}
        </div>
    </>
  );
};

export default OptionsMenu;