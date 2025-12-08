import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Conversation, Message, User, Location } from '../../types';
import { currentUser } from '../../constants';
import { ChevronLeftIcon, SendIcon, CheckIcon, CheckCheckIcon, MapPinIcon } from '../icons';
import LocationPickerModal from '../LocationPickerModal';

const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const ConversationListItem: React.FC<{
    conversation: Conversation;
    isSelected: boolean;
    onClick: () => void;
}> = ({ conversation, isSelected, onClick }) => {
    const otherUser = conversation.participants.find(p => p.id !== currentUser.id) as User;
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    const lastMessageText = () => {
        if (!lastMessage) return "No messages yet";
        if (lastMessage.location) return `📍 Shared a location: ${lastMessage.location.name}`;
        return lastMessage.text;
    }

    return (
        <button onClick={onClick} className={`w-full text-left p-3 flex items-center space-x-3 transition-colors ${isSelected ? 'bg-teal-50' : 'hover:bg-gray-100'}`}>
            <div className="relative">
                <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-12 h-12 rounded-full" />
                {conversation.unreadCount > 0 && 
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                }
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800 truncate">{otherUser.name}</p>
                    {lastMessage && <p className="text-xs text-gray-500 flex-shrink-0">{formatTimestamp(lastMessage.timestamp)}</p>}
                </div>
                <p className={`text-sm text-gray-600 truncate ${conversation.unreadCount > 0 ? 'font-bold' : ''}`}>{lastMessageText()}</p>
            </div>
        </button>
    );
};

const LocationBubble: React.FC<{ location: Location }> = ({ location }) => (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
                <MapPinIcon className="w-6 h-6 text-gray-500" />
            </div>
            <div>
                <p className="font-semibold text-gray-800">{location.name}</p>
                <p className="text-xs text-gray-500">Shared Location</p>
            </div>
        </div>
        <a 
            href={location.mapUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-3 text-center w-full bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
            Get Directions
        </a>
    </div>
);


const MessageBubble: React.FC<{ message: Message; isMe: boolean }> = ({ message, isMe }) => {
    const StatusIcon = () => {
        if (!isMe) return null;
        switch (message.status) {
            case 'read': return <CheckCheckIcon className="w-4 h-4 text-blue-500" />;
            case 'delivered': return <CheckCheckIcon className="w-4 h-4 text-gray-400" />;
            case 'sent': return <CheckIcon className="w-4 h-4 text-gray-400" />;
            default: return null;
        }
    };
    return (
        <div className={`flex items-end space-x-2 ${isMe ? 'justify-end' : ''}`}>
            <div className={`max-w-xs md:max-w-md rounded-2xl ${isMe ? 'bg-teal-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                 {message.location ? (
                    <LocationBubble location={message.location} />
                ) : (
                    <p className="px-4 py-2">{message.text}</p>
                )}
            </div>
            {isMe && <StatusIcon />}
        </div>
    );
};


interface ChatPageProps {
    conversations: Conversation[];
    onSendMessage: (conversationId: string, message: Message) => void;
    onMarkAsRead: (conversationId: string) => void;
    initialConversationId?: string;
}

const ChatPage: React.FC<ChatPageProps> = ({ conversations, onSendMessage, onMarkAsRead, initialConversationId }) => {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialConversationId) {
            setActiveConversationId(initialConversationId);
            onMarkAsRead(initialConversationId);
        } else if (conversations.length > 0) {
            setActiveConversationId(conversations[0].id);
            onMarkAsRead(conversations[0].id);
        }
    }, [initialConversationId, conversations, onMarkAsRead]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversationId, conversations]);

    const activeConversation = useMemo(() => {
        return conversations.find(c => c.id === activeConversationId);
    }, [activeConversationId, conversations]);

    const otherUser = useMemo(() => {
        return activeConversation?.participants.find(p => p.id !== currentUser.id);
    }, [activeConversation]);

    const handleSelectConversation = (conversationId: string) => {
        setActiveConversationId(conversationId);
        onMarkAsRead(conversationId);
    };

    const handleSendMessage = (e?: React.FormEvent, location?: Location) => {
        if (e) e.preventDefault();
        if ((!messageText.trim() && !location) || !activeConversation) return;

        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            text: location ? `📍 ${location.name}` : messageText,
            timestamp: Date.now(),
            status: 'sent',
            ...(location && { location }),
        };
        onSendMessage(activeConversation.id, newMessage);
        setMessageText('');

        // Don't simulate reply for location messages
        if (location) return;

        // Simulate reply
        setTimeout(() => {
             setIsTyping(true);
             messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
        setTimeout(() => {
            setIsTyping(false);
            const replyMessage: Message = {
                 id: `msg_${Date.now() + 1}`,
                 senderId: otherUser!.id,
                 text: 'Thanks for reaching out! I will get back to you shortly.',
                 timestamp: Date.now(),
                 status: 'delivered'
            };
            onSendMessage(activeConversation.id, replyMessage);
        }, 3000);
    };

    const handleLocationSelect = (location: Location) => {
        setIsLocationPickerOpen(false);
        handleSendMessage(undefined, location);
    };

    return (
        <>
        <div className="max-w-md mx-auto h-[calc(100vh-8rem)] bg-white border-x flex flex-col">
            {!activeConversation || !otherUser ? (
                <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(c => (
                            <ConversationListItem
                                key={c.id}
                                conversation={c}
                                isSelected={false}
                                onClick={() => handleSelectConversation(c.id)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    <header className="p-3 border-b flex items-center space-x-3 bg-gray-50">
                        <button onClick={() => setActiveConversationId(null)} className="md:hidden text-gray-600">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-bold text-gray-800">{otherUser.name}</p>
                            <p className="text-xs text-gray-500">Online</p>
                        </div>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
                        {activeConversation.messages.map(msg => (
                            <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === currentUser.id} />
                        ))}
                        {isTyping && (
                            <div className="flex items-end space-x-2">
                                <div className="max-w-xs md:max-w-md px-4 py-2 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-none">
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-3 border-t bg-white flex items-center space-x-2">
                        <button type="button" onClick={() => setIsLocationPickerOpen(true)} className="text-gray-500 hover:text-teal-600 p-2">
                            <MapPinIcon className="w-6 h-6" />
                        </button>
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full bg-gray-100 border-transparent rounded-full px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                        <button type="submit" className="bg-teal-600 text-white rounded-full p-2.5 hover:bg-teal-700 transition-colors">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
        <LocationPickerModal
            isOpen={isLocationPickerOpen}
            onClose={() => setIsLocationPickerOpen(false)}
            onLocationSelect={handleLocationSelect}
        />
        </>
    );
};

export default ChatPage;