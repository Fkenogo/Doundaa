
import React, { useState } from 'react';
import { Interest, MAIN_CATEGORIES } from '../interests';
import { CheckCircleIcon } from './icons';

interface InterestTagProps {
    interest: Interest;
    variant: 'pill' | 'card';
    isSelected: boolean;
    onClick: (id: string) => void;
}

const InterestTag: React.FC<InterestTagProps> = ({ interest, variant, isSelected, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const category = MAIN_CATEGORIES.find(c => c.id === interest.category);
    const colors = category?.colors || { primary: '#0d9488', light: '#f0fdfa', dark: '#0f172a' };

    const handleClick = () => onClick(interest.id);

    if (variant === 'pill') {
        return (
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-wider transition-all duration-300 border-2 active:scale-90
                    ${isSelected 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' 
                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 shadow-sm'
                    }
                `}
                style={isSelected ? { backgroundColor: colors.primary, borderColor: colors.primary } : {}}
            >
                <span className={`text-base ${isSelected ? '' : 'grayscale opacity-70'}`}>{interest.emoji}</span>
                <span>{interest.name}</span>
            </button>
        );
    }
    
    if (variant === 'card') {
        return (
            <button
                onClick={handleClick}
                className={`
                    relative aspect-square w-full rounded-[32px] p-6 flex flex-col items-center justify-center space-y-3 transition-all duration-500 border-2 active:scale-95
                    ${isSelected 
                        ? 'bg-white border-teal-500 shadow-[0_20px_40px_rgba(13,148,136,0.15)] ring-4 ring-teal-500/5' 
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-200 shadow-sm'
                    }
                `}
                style={isSelected ? { borderColor: colors.primary, ringColor: `${colors.primary}10` } : {}}
            >
                 {isSelected && (
                    <div className="absolute top-4 right-4 bg-teal-600 rounded-full p-1 shadow-lg animate-fade-in-up">
                         <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                 )}
                 <span className={`text-5xl transition-transform duration-500 ${isSelected ? 'scale-110 drop-shadow-xl' : 'grayscale opacity-60'}`}>
                    {interest.emoji}
                 </span>
                 <p className={`text-[11px] font-black uppercase tracking-widest leading-tight ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                    {interest.name}
                 </p>
            </button>
        );
    }

    return null;
};

export default InterestTag;
