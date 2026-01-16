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
    const colors = category?.colors || { primary: '#00B8FF', light: '#E6F7FF', dark: '#005B7F' };

    const handleClick = () => onClick(interest.id);
    const ariaLabel = `${interest.name} - ${category?.name || 'General'} category - ${isSelected ? 'Currently selected' : 'Currently not selected'}`;

    if (variant === 'pill') {
        const baseStyle: React.CSSProperties = {
            height: '42px',
            padding: '8px 18px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 700,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            border: '2px solid transparent',
        };

        const unselectedStyle: React.CSSProperties = { 
            background: '#F9FAFB', 
            borderColor: '#F3F4F6', 
            color: '#4B5563' 
        };
        const selectedStyle: React.CSSProperties = { 
            background: colors.primary, 
            color: 'white',
            boxShadow: `0 10px 15px -3px ${colors.primary}33`
        };
        const hoverStyle: React.CSSProperties = { 
            background: colors.light, 
            borderColor: colors.primary, 
            transform: 'translateY(-2px)' 
        };

        const style = isSelected ? selectedStyle : (isHovered ? hoverStyle : unselectedStyle);
        const iconStyle: React.CSSProperties = { 
            fontSize: '18px',
            filter: isSelected ? 'none' : 'grayscale(100%) brightness(1.2)'
        };

        return (
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={ariaLabel}
                style={{ ...baseStyle, ...style }}
                className="focus:outline-none focus:ring-4 focus:ring-teal-500/20 active:scale-95 transition-all"
            >
                <span style={iconStyle} aria-hidden="true">{interest.emoji}</span>
                <span className="tracking-tight">{interest.name}</span>
            </button>
        );
    }
    
    if (variant === 'card') {
         const baseStyle: React.CSSProperties = {
            width: '100%',
            aspectRatio: '1/1',
            borderRadius: '28px',
            padding: '24px',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        };

        const unselectedStyle: React.CSSProperties = { 
            background: '#F9FAFB', 
            border: '2px solid #F3F4F6' 
        };
        const selectedStyle: React.CSSProperties = { 
            background: 'white', 
            border: `3px solid ${colors.primary}`,
            boxShadow: `0 20px 30px -10px ${colors.primary}33`,
            transform: 'scale(1.02)'
        };
        
        const currentStyle = isSelected ? selectedStyle : unselectedStyle;
        const iconStyle: React.CSSProperties = { 
            fontSize: '48px', 
            filter: isSelected ? 'drop-shadow(0 10px 8px rgba(0,0,0,0.1))' : 'grayscale(30%)' 
        };
        const textStyle: React.CSSProperties = { 
            fontSize: '13px', 
            fontWeight: 800,
            color: isSelected ? '#111827' : '#6B7280',
            marginTop: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px'
        };

        return (
            <button
                onClick={handleClick}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={ariaLabel}
                style={{...baseStyle, ...currentStyle}}
                className={`relative text-center flex flex-col items-center justify-center space-y-1 transform active:scale-90 focus:outline-none group`}
            >
                 {isSelected && (
                    <div className="absolute top-4 right-4 bg-teal-600 rounded-full p-1 shadow-lg animate-fade-in-up">
                         <CheckCircleIcon className="w-5 h-5 text-white" />
                    </div>
                 )}
                 <span style={iconStyle} aria-hidden="true" className="group-hover:scale-110 transition-transform duration-300">
                    {interest.emoji}
                 </span>
                 <p style={textStyle} className="leading-tight">{interest.name}</p>
            </button>
        );
    }

    return null;
};

export default InterestTag;