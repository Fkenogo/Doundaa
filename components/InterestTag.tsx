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
            height: '32px',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            border: '1px solid transparent',
        };

        const unselectedStyle: React.CSSProperties = { background: '#F5F5F5', borderColor: '#E0E0E0', color: '#4A4A4A' };
        const selectedStyle: React.CSSProperties = { background: colors.primary, color: 'white' };
        const hoverStyle: React.CSSProperties = { background: colors.light, borderColor: colors.primary, transform: 'scale(1.02)' };

        const style = isSelected ? selectedStyle : (isHovered ? hoverStyle : unselectedStyle);
        const iconStyle: React.CSSProperties = { color: isSelected ? 'white' : (isHovered ? colors.primary : '#9E9E9E'), fontSize: '16px' };

        return (
            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={ariaLabel}
                style={{ ...baseStyle, ...style }}
                className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
                <span style={iconStyle} aria-hidden="true">{interest.emoji}</span>
                <span>{interest.name}</span>
            </button>
        );
    }
    
    if (variant === 'card') {
         const baseStyle: React.CSSProperties = {
            width: '96px',
            height: '96px',
            borderRadius: '12px',
            padding: '12px',
            transition: 'all 0.2s ease',
        };

        const unselectedStyle: React.CSSProperties = { background: 'white', border: '2px solid #E0E0E0' };
        const selectedStyle: React.CSSProperties = { background: colors.light, border: `3px solid ${colors.primary}` };
        
        const currentStyle = isSelected ? selectedStyle : unselectedStyle;
        const iconStyle: React.CSSProperties = { fontSize: '32px', color: isSelected ? colors.primary : '#9E9E9E' };
        const textStyle: React.CSSProperties = { fontSize: '14px', color: isSelected ? colors.dark : '#4A4A4A' };

        return (
            <button
                onClick={handleClick}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={ariaLabel}
                style={{...baseStyle, ...currentStyle}}
                className={`relative text-center flex flex-col items-center justify-center space-y-1 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500`}
            >
                 {isSelected && <CheckCircleIcon className="w-5 h-5 absolute top-2 right-2" style={{color: colors.primary}} />}
                 <span style={iconStyle} aria-hidden="true">{interest.emoji}</span>
                 <p style={textStyle} className="font-semibold leading-tight">{interest.name}</p>
            </button>
        );
    }

    return null;
};

export default InterestTag;