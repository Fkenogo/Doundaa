
import React from 'react';
import { MapPinIcon, NavigationIcon, CheckIcon } from './icons';

interface DirectionsChooserModalProps {
    isOpen: boolean;
    onClose: () => void;
    locationName: string;
    customUrl?: string; // NEW: Provision for direct Google Map links
}

const GoogleMapsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#4285F4"/>
        <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>
);

const AppleMapsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="5" fill="#FFFFFF"/>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#5E97F6"/>
        <path d="M17.5 7L7 12.5L12.5 14L14 19.5L17.5 7Z" fill="white"/>
    </svg>
);

const WazeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#33CCFF"/>
        <path d="M17.5 12.5C17.5 15.5376 15.0376 18 12 18C8.96243 18 6.5 15.5376 6.5 12.5C6.5 9.46243 8.96243 7 12 7C15.0376 7 17.5 9.46243 17.5 12.5Z" fill="white"/>
        <circle cx="10" cy="11" r="1" fill="#4A4A4A"/>
        <circle cx="14" cy="11" r="1" fill="#4A4A4A"/>
        <path d="M9 14C9.5 15 10.5 15.5 12 15.5C13.5 15.5 14.5 15 15 14" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const DirectionsChooserModal: React.FC<DirectionsChooserModalProps> = ({ isOpen, onClose, locationName, customUrl }) => {
    const [copied, setCopied] = React.useState(false);

    if (!isOpen) return null;

    const encodedLocation = encodeURIComponent(locationName);

    const mapOptions = [
        { name: 'Google Maps', Icon: GoogleMapsIcon, url: customUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`, color: 'text-blue-600' },
        { name: 'Apple Maps', Icon: AppleMapsIcon, url: `http://maps.apple.com/?daddr=${encodedLocation}`, color: 'text-gray-900' },
        { name: 'Waze Navigation', Icon: WazeIcon, url: `https://waze.com/ul?q=${encodedLocation}`, color: 'text-cyan-500' },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(customUrl || locationName);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end sm:items-center z-[200] transition-all duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-t-[40px] sm:rounded-[32px] shadow-2xl p-8 max-w-sm w-full transform transition-all duration-300 animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8 sm:hidden"></div>
                
                <div className="text-center space-y-2 mb-8">
                    <div className="w-16 h-16 bg-teal-50 rounded-[24px] flex items-center justify-center mx-auto mb-4">
                        <NavigationIcon className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Get Directions</h3>
                    <p className="text-sm font-medium text-gray-400 px-4 line-clamp-1">To: {locationName}</p>
                    {customUrl && (
                        <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-1">Direct Map Link Provided ✓</p>
                    )}
                </div>

                <div className="space-y-3">
                    {mapOptions.map(({ name, Icon, url, color }) => (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center p-4 bg-gray-50/50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-[22px] transition-all active:scale-[0.98] group"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2.5 mr-4 transition-transform group-hover:scale-110">
                                <Icon className="w-full h-full" />
                            </div>
                            <span className={`font-black text-sm uppercase tracking-widest ${color}`}>{name}</span>
                        </a>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                    <button 
                        onClick={handleCopy}
                        className="w-full flex items-center justify-center space-x-2 py-4 text-[10px] font-black uppercase tracking-[2px] text-gray-400 hover:text-teal-600 transition-colors"
                    >
                        {copied ? (
                            <>
                                <CheckIcon className="w-4 h-4 text-green-500" />
                                <span className="text-green-600">Copied to Clipboard!</span>
                            </>
                        ) : (
                            <>
                                <MapPinIcon className="w-4 h-4" />
                                <span>Copy Map Link</span>
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-gray-900 text-white font-black rounded-[20px] text-sm active:scale-95 transition-all shadow-xl shadow-gray-900/10"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectionsChooserModal;
