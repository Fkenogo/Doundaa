
import React, { useState } from 'react';
import { User } from '../types';
import { ShareIcon, CheckIcon } from './icons';

const TwitterIcon: React.FC<{className?: string}> = ({className}) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path></svg>);
const FacebookIcon: React.FC<{className?: string}> = ({className}) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"></path></svg>);
const WhatsAppIcon: React.FC<{className?: string}> = ({className}) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.888-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg>);
const InstagramIcon: React.FC<{className?: string}> = ({className}) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    text: string;
    url: string;
    friends: User[];
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title, text, url, friends }) => {
    const [copySuccess, setCopySuccess] = useState('');
    const [sentStatus, setSentStatus] = useState<{[key: string]: boolean}>({});

    if (!isOpen) return null;

    const handleSend = (friendId: string) => {
        setSentStatus(prev => ({...prev, [friendId]: true}));
        console.log(`Shared with friend: ${friendId}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed!');
        });
    };

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    const primaryShareOptions = [
        { name: 'WhatsApp', icon: WhatsAppIcon, url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, color: 'bg-[#25D366]' },
        { name: 'Facebook', icon: FacebookIcon, url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'bg-[#1877F2]' },
        { name: 'Instagram', icon: InstagramIcon, url: `instagram://sharesheet?text=${encodedText}%20${encodedUrl}`, color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]' },
        { name: 'X', icon: TwitterIcon, url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, color: 'bg-black' },
    ];

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-end sm:items-center z-[210] transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#f2f2f7] rounded-t-[40px] sm:rounded-[32px] max-w-sm w-full transform transition-all duration-300 animate-fade-in-up flex flex-col overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-white px-8 py-5 border-b border-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center p-2 text-teal-600">
                        <ShareIcon className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-black text-gray-900 truncate tracking-tight">{title}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{url.split('/').pop()}</p>
                    </div>
                </div>

                {/* Quick Share with Friends (Horizontal Scroll) */}
                <div className="p-6 overflow-x-auto no-scrollbar border-b border-gray-100 bg-white">
                    <div className="flex space-x-6 min-w-max">
                        {friends.map(friend => (
                            <button key={friend.id} onClick={() => handleSend(friend.id)} className="flex flex-col items-center space-y-2 group">
                                <div className="relative">
                                    <img src={friend.avatarUrl} alt={friend.name} className="w-16 h-16 rounded-full border-2 border-white shadow-md group-active:scale-95 transition-transform" />
                                    {sentStatus[friend.id] && (
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                                            <CheckIcon className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-1 right-1 bg-teal-600 w-4 h-4 rounded-full border-2 border-white"></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 truncate max-w-[64px]">{friend.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main App Icons Grid */}
                <div className="p-6 bg-white">
                    <div className="flex justify-between items-center px-1">
                        {primaryShareOptions.map(opt => (
                            <a href={opt.url} key={opt.name} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                                <div className={`${opt.color} w-14 h-14 rounded-2xl flex items-center justify-center p-3.5 text-white shadow-xl group-active:scale-90 transition-transform`}>
                                    <opt.icon className="w-full h-full" />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3">{opt.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Action List (iOS Style) */}
                <div className="p-4 space-y-2 mb-4">
                    <button 
                        onClick={copyToClipboard}
                        className="w-full bg-white flex items-center justify-between p-4 rounded-2xl active:bg-gray-100 transition-colors group shadow-sm"
                    >
                        <span className="text-sm font-bold text-gray-900">Copy Link</span>
                        {copySuccess ? (
                            <CheckIcon className="w-5 h-5 text-green-500" />
                        ) : (
                            <ShareIcon className="w-5 h-5 text-gray-400 group-active:scale-110 transition-transform" />
                        )}
                    </button>
                    
                    <button 
                        onClick={onClose}
                        className="w-full bg-white flex items-center justify-center p-4 rounded-2xl text-red-500 font-black uppercase tracking-[2px] text-xs shadow-sm active:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
