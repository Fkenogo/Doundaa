import React, { useState, useRef } from 'react';
import { Comment, User, Location } from '../types';
import { PaperclipIcon, MapPinIcon } from './icons';
import LocationPickerModal from './LocationPickerModal';

type Attachment = {
    type: 'image' | 'video';
    url: string;
};

interface CommentProps {
    comment: Comment;
    onAddReply: (text: string, parentId: string, attachment?: Attachment, location?: Location) => void;
}

const LocationCard: React.FC<{location: Location}> = ({ location }) => (
    <div className="mt-2 p-2.5 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-2.5">
            <div className="bg-gray-100 p-2 rounded-lg">
                <MapPinIcon className="w-5 h-5 text-gray-500" />
            </div>
            <div>
                <p className="font-semibold text-sm text-gray-800">{location.name}</p>
                <a 
                    href={location.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-teal-600 hover:underline"
                >
                    Get Directions
                </a>
            </div>
        </div>
    </div>
);


const CommentItem: React.FC<CommentProps> = ({ comment, onAddReply }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const type = file.type.startsWith('image/') ? 'image' : 'video';
            setAttachment({ url, type });
        }
    };

    const handleReplySubmit = (e: React.FormEvent, location?: Location) => {
        e.preventDefault();
        if (replyText.trim() || attachment || location) {
            onAddReply(replyText, comment.id, attachment, location);
            setReplyText('');
            setAttachment(undefined);
            setShowReplyInput(false);
        }
    };
    
    const handleLocationSelect = (location: Location) => {
        setIsLocationPickerOpen(false);
        onAddReply('', comment.id, undefined, location);
        setShowReplyInput(false);
    };


    return (
        <div className="flex items-start space-x-3">
            <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-8 h-8 rounded-full mt-1" />
            <div className="flex-1">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-gray-800">{comment.user.name}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>
                    {comment.text && <p className="text-sm text-gray-700">{comment.text}</p>}
                    {comment.location && <LocationCard location={comment.location} />}
                    {comment.attachment && (
                        <div className="mt-2">
                            {comment.attachment.type === 'image' ? (
                                <img src={comment.attachment.url} alt="comment attachment" className="max-h-48 rounded-lg" />
                            ) : (
                                <video src={comment.attachment.url} controls className="max-h-48 rounded-lg" />
                            )}
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => setShowReplyInput(!showReplyInput)} 
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 mt-1"
                >
                    Reply
                </button>

                {showReplyInput && (
                    <div className="mt-2">
                         <form onSubmit={handleReplySubmit} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Reply to ${comment.user.name}...`}
                                className="w-full bg-white border border-gray-300 text-sm rounded-full px-3 py-1.5 focus:ring-teal-500 focus:border-teal-500"
                            />
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden"/>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-teal-600">
                                <PaperclipIcon className="w-5 h-5"/>
                            </button>
                             <button type="button" onClick={() => setIsLocationPickerOpen(true)} className="text-gray-500 hover:text-teal-600">
                                <MapPinIcon className="w-5 h-5"/>
                            </button>
                            <button type="submit" className="text-sm font-semibold text-teal-600 hover:text-teal-800">Post</button>
                        </form>
                        {attachment && (
                            <div className="mt-2 pl-10">
                                {attachment.type === 'image' ? (
                                    <img src={attachment.url} alt="reply preview" className="max-h-24 rounded-md" />
                                ) : (
                                    <video src={attachment.url} controls className="max-h-24 rounded-md" />
                                )}
                            </div>
                        )}
                        <LocationPickerModal 
                            isOpen={isLocationPickerOpen}
                            onClose={() => setIsLocationPickerOpen(false)}
                            onLocationSelect={handleLocationSelect}
                        />
                    </div>
                )}
                
                {comment.replies.length > 0 && (
                    <div className="mt-2 space-y-2">
                        {comment.replies.map(reply => (
                           <div key={reply.id} className="flex items-start space-x-3">
                                <img src={reply.user.avatarUrl} alt={reply.user.name} className="w-8 h-8 rounded-full mt-1" />
                                <div className="flex-1">
                                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-sm text-gray-800">{reply.user.name}</span>
                                            <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                        </div>
                                        {reply.text && <p className="text-sm text-gray-700">{reply.text}</p>}
                                        {reply.location && <LocationCard location={reply.location} />}
                                        {reply.attachment && (
                                            <div className="mt-2">
                                                {reply.attachment.type === 'image' ? (
                                                    <img src={reply.attachment.url} alt="reply attachment" className="max-h-40 rounded-lg" />
                                                ) : (
                                                    <video src={reply.attachment.url} controls className="max-h-40 rounded-lg" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
};


interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string, attachment?: Attachment, location?: Location) => void;
  onAddReply: (text: string, parentId: string, attachment?: Attachment, location?: Location) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment, onAddReply }) => {
  const [newComment, setNewComment] = useState('');
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        setAttachment({ url, type });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent, location?: Location) => {
    e.preventDefault();
    if (newComment.trim() || attachment || location) {
      onAddComment(newComment, attachment, location);
      setNewComment('');
      setAttachment(undefined);
    }
  };
  
  const handleLocationSelect = (location: Location) => {
    setIsLocationPickerOpen(false);
    onAddComment('', undefined, location);
  };


  return (
    <>
    <div className="bg-white p-4 border-t">
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} onAddReply={onAddReply} />
        ))}
      </div>
      <div className="mt-4">
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
            <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full bg-gray-100 border border-gray-200 text-sm rounded-full px-4 py-2 focus:ring-teal-500 focus:border-teal-500"
            />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden"/>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-teal-600">
                <PaperclipIcon className="w-5 h-5"/>
            </button>
            <button type="button" onClick={() => setIsLocationPickerOpen(true)} className="text-gray-500 hover:text-teal-600">
                <MapPinIcon className="w-5 h-5"/>
            </button>
            <button type="submit" className="text-sm font-bold text-teal-600 hover:text-teal-800 px-4 py-2 rounded-full">
                Post
            </button>
        </form>
        {attachment && (
            <div className="mt-2 pl-4">
                {attachment.type === 'image' ? (
                    <img src={attachment.url} alt="comment preview" className="max-h-24 rounded-md" />
                ) : (
                    <video src={attachment.url} controls className="max-h-24 rounded-md" />
                )}
            </div>
        )}
      </div>
    </div>
    <LocationPickerModal 
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={handleLocationSelect}
    />
    </>
  );
};

export default CommentSection;