import React from 'react';

interface DirectionsChooserModalProps {
    isOpen: boolean;
    onClose: () => void;
    locationName: string;
}

const GoogleMapsIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} viewBox="0 0 14 20"><path d="M7,0C3.13,0,0,3.13,0,7c0,5.25,7,13,7,13s7-7.75,7-13C14,3.13,10.87,0,7,0z M7,9.5C5.62,9.5,4.5,8.38,4.5,7S5.62,4.5,7,4.5S9.5,5.62,9.5,7S8.38,9.5,7,9.5z" fill="#4285F4"/></svg>);
const AppleMapsIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.833 21.927c-1.396-.44-2.618-1.026-3.875-1.958l1.699-2.943c.839.634 1.748 1.129 2.76 1.444l-.584 3.457zm8.016-3.763c-.8.67-1.631 1.25-2.584 1.718l-1.699-2.943c.607-.29 1.18-.668 1.708-1.125l2.575 2.35zm-2.029-4.269l-3.234-1.867-1.866 3.233-3.234-1.867 3.234-5.599 5.599 3.233-1.708 2.955c.03.051.058.103.084.156l1.421-2.461c.143-.248.067-.577-.181-.72l-5.599-3.233c-.248-.143-.577-.067-.72.181l-3.234 5.599c-.143.248-.067.577.181.72l3.234 1.867c.1.058.21.085.32.085.161 0 .319-.059.439-.17l1.867-3.234 1.719.993c-.015.026-.03.052-.045.078l-2.083-1.204-1.204 2.085c-.11.191-.038.435.153.545l3.234 1.867c.191.11.435.038.545-.153l1.867-3.234c.046-.079.072-.167.072-.259 0-.092-.026-.18-.072-.259z" fill="#5A99EE"/></svg>);
const WazeIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} viewBox="0 0 24 24"><path d="M12,24c6.6,0,12-5.4,12-12S18.6,0,12,0S0,5.4,0,12S5.4,24,12,24z" fill="#33CCFF"/><path d="M12.7,11.3c0.1-0.4-0.1-0.8-0.4-1l-2.3-2.3c-0.1-0.1-0.2-0.2-0.4-0.2c-0.3-0.1-0.7,0-0.9,0.3 c-0.1,0.1-0.2,0.2-0.2,0.4c0,0.3,0,0.7,0.3,0.9l2.3,2.3c0.1,0.1,0.2,0.2,0.4,0.2C11.9,11.9,12.4,11.8,12.7,11.3z" fill="#FFF"/><path d="M16.9,8c0.1-0.4-0.1-0.8-0.4-1l-2.3-2.3c-0.1-0.1-0.2-0.2-0.4-0.2c-0.3-0.1-0.7,0-0.9,0.3 c-0.1,0.1-0.2,0.2-0.2,0.4c0,0.3,0,0.7,0.3,0.9l2.3,2.3c0.1,0.1,0.2,0.2,0.4,0.2C16.1,9,16.6,8.8,16.9,8z" fill="#FFF"/><path d="M14.6,18.8c0.8,0,1.5-0.7,1.5-1.5c0-0.8-0.7-1.5-1.5-1.5c-0.8,0-1.5,0.7-1.5,1.5 C13.1,18.2,13.8,18.8,14.6,18.8z" fill="#4A4A4A"/><path d="M7.6,18.8c0.8,0,1.5-0.7,1.5-1.5c0-0.8-0.7-1.5-1.5-1.5c-0.8,0-1.5,0.7-1.5,1.5C6.1,18.2,6.8,18.8,7.6,18.8z" fill="#4A4A4A"/><path d="M11.1,12.5c0-0.5-0.4-1-1-1H9c-0.5,0-1,0.4-1,1v1.1c0,1.3,1.1,2.4,2.4,2.4c0.1,0,0.2,0,0.2,0 c1.3,0,2.4-1.1,2.4-2.4V12.5z" fill="#4A4A4A"/></svg>);


const DirectionsChooserModal: React.FC<DirectionsChooserModalProps> = ({ isOpen, onClose, locationName }) => {
    if (!isOpen) return null;

    const encodedLocation = encodeURIComponent(locationName);

    const mapOptions = [
        { name: 'Google Maps', Icon: GoogleMapsIcon, url: `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}` },
        { name: 'Apple Maps', Icon: AppleMapsIcon, url: `http://maps.apple.com/?daddr=${encodedLocation}` },
        { name: 'Waze', Icon: WazeIcon, url: `https://waze.com/ul?q=${encodedLocation}` },
    ];

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-sm w-full transform transition-all duration-300 opacity-0 animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold text-gray-900 text-center">Get Directions</h3>
                <p className="text-sm text-center text-gray-500 mt-1">to {locationName}</p>

                <div className="mt-6 space-y-3">
                    {mapOptions.map(({ name, Icon, url }) => (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Icon className="w-8 h-8 mr-4 flex-shrink-0" />
                            <span className="font-semibold text-gray-800">{name}</span>
                        </a>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DirectionsChooserModal;