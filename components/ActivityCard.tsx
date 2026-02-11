
import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Provider, Comment, User, Location, Page } from '../types';
// Added PlusCircleIcon to imports
import { AwardIcon, BookmarkIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, CreditCardIcon, HeartIcon, MapPinIcon, MessageSquareIcon, ShareIcon, StarIcon, TagIcon, UsersIcon, MoreVerticalIcon, NavigationIcon, RefreshCwIcon, MessageCircleIcon, SparklesIcon, PlusCircleIcon } from './icons';
import { ALL_INTERESTS_MAP } from '../interests';
import CommentSection from './CommentSection';
import BookingForm, { BookingDetails } from './BookingForm';
import ShareModal from './ShareModal';
import { mockFriends } from '../constants';
import OptionsMenu from './OptionsMenu';
import ReportModal, { ReportDetails } from './ReportModal';
import DirectionsChooserModal from './DirectionsChooserModal';
import InterestTag from './InterestTag';

interface ActivityCardProps {
  activity: Activity;
  onFollowToggle: (providerId: string, isFollowing: boolean) => void;
  onStartConversation: (provider: Provider) => void;
  onNavigate: (page: Page, profileUser?: User | Provider) => void;
  isAuthenticated: boolean;
  onRequestAuth: () => void;
  userInterests: string[];
}

const currentUser: User = { 
    id: 'u4', 
    name: 'Chris Kayumba', 
    avatarUrl: 'https://i.pravatar.cc/150?u=u4',
    isVerified: false,
    verificationLevel: 1
};
const CAPTION_MAX_LENGTH = 100;

const VerificationBadge: React.FC<{ level: number }> = ({ level }) => {
    if (level <= 1) {
        return (
            <div className="relative group flex items-center">
                <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded-lg border border-slate-200 shadow-sm">New</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-slate-900 text-white text-[10px] font-black rounded-lg py-1.5 px-3 z-30 shadow-2xl">
                    New Provider
                </div>
            </div>
        );
    }
    
    const badges: {[key: number]: { color: string; name: string; description: string }} = {
        2: { color: 'text-orange-500', name: 'Bronze Verified', description: 'Phone & Email Verified' },
        3: { color: 'text-slate-500', name: 'Silver Verified', description: 'Socials Connected' },
        4: { color: 'text-amber-500', name: 'Gold Verified', description: 'Business Docs Verified' },
        5: { color: 'text-teal-600', name: 'Official Partner', description: 'Doundaa Partner' },
    };

    const badge = badges[level];
    if (!badge) return null;

    return (
        <div className="relative group flex items-center">
            <div className="bg-white rounded-full p-1 shadow-md border border-slate-100">
              <AwardIcon className={`w-4 h-4 ${badge.color}`} />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-slate-900 text-white text-[10px] font-black rounded-lg py-1.5 px-3 z-30 shadow-2xl">
                {badge.name}
            </div>
        </div>
    );
};


const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onFollowToggle, onStartConversation, onNavigate, isAuthenticated, onRequestAuth, userInterests }) => {
  const { title, description, provider, category, location, dateTime, price, interestedCount, matchCount, images, isTimeSensitive, groupSize, distance, isRecurring, interestIds } = activity;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInterested, setIsInterested] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDoundaaRequested, setIsDoundaaRequested] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false); 
  const [currentInterestedCount, setCurrentInterestedCount] = useState(interestedCount);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(provider.following);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(activity.comments || []);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  
  const matchingInterestsCount = useMemo(() => {
      if (!userInterests || userInterests.length === 0) return 0;
      const userInterestSet = new Set(userInterests);
      return interestIds.filter(id => userInterestSet.has(id)).length;
  }, [userInterests, interestIds]);

  const totalCommentCount = useMemo(() => {
    return comments.reduce((acc, comment) => acc + 1 + comment.replies.length, 0);
  }, [comments]);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);
  
  const handleProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      onRequestAuth();
    } else {
      action();
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleInterestClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newInterestedState = !isInterested;
    setIsInterested(newInterestedState);
    setCurrentInterestedCount(current => newInterestedState ? current + 1 : current - 1);
  };

  const handleSaveClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    setFeedbackMessage(newSavedState ? 'Doundaa saved!' : 'Removed from saved.');
  };

  // Fixed: Added handleShareClick function
  const handleShareClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleFollowAction = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    onFollowToggle(provider.id, newFollowingState);
    setFeedbackMessage(newFollowingState ? `Followed @${provider.name}` : `Unfollowed @${provider.name}`);
  };
  
  const toggleFocus = () => {
    setIsFocused(!isFocused);
    if (!isFocused) {
        setIsCaptionExpanded(true); 
    }
  };

  const handleAddComment = (text: string, attachment?: any, location?: any) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: currentUser,
      text,
      timestamp: 'Just now',
      replies: [],
      attachment,
      location,
    };
    setComments([...comments, newComment]);
  };

  const handleAddReply = (text: string, parentId: string, attachment?: any, location?: any) => {
    const newReply: Comment = {
      id: `c${Date.now()}`,
      user: currentUser,
      text,
      timestamp: 'Just now',
      replies: [],
      attachment,
      location,
    };
    const updatedComments = comments.map(comment => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, newReply] };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const ratingDisplay = provider.rating % 1 === 0 ? provider.rating : provider.rating.toFixed(1);
  const activityTags = interestIds.map(id => ALL_INTERESTS_MAP.get(id)).filter((i): i is NonNullable<typeof i> => !!i).slice(0, 3);

  const renderCardContent = (isPopOut: boolean) => (
    <div className={`${isPopOut ? 'bg-white h-full flex flex-col overflow-y-auto no-scrollbar' : ''}`}>
        {/* Media Section */}
        <div className="relative group">
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 z-[200] ${feedbackMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
            {feedbackMessage}
          </div>

          <div 
            onClick={!isPopOut ? toggleFocus : undefined}
            className={`${isPopOut ? 'h-[50vh] min-h-[400px]' : 'h-64'} w-full bg-slate-200 transition-all duration-700 ease-in-out cursor-pointer relative overflow-hidden`} 
          >
             <img 
               src={images[currentImageIndex]} 
               alt={title} 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
             />
             {isPopOut && (
                 <button 
                    onClick={toggleFocus} 
                    className="absolute top-10 left-6 bg-white/30 backdrop-blur-2xl text-white p-4 rounded-2xl border border-white/40 shadow-2xl active:scale-90 transition-all z-50"
                 >
                    <ChevronLeftIcon className="w-6 h-6" />
                 </button>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20 opacity-60"></div>
          </div>

          {isTimeSensitive && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[2px] px-3.5 py-2 rounded-xl z-10 shadow-xl shadow-red-600/20">LIVE NOW</span>
          )}

          {images.length > 1 && (
            <>
              <button onClick={handlePrevImage} className={`absolute top-1/2 -translate-y-1/2 left-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-10 shadow-2xl active:scale-90`}>
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button onClick={handleNextImage} className={`absolute top-1/2 -translate-y-1/2 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all z-10 shadow-2xl active:scale-90`}>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2.5 z-10`}>
                {images.map((_, index) => (
                  <button key={index} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/40 w-1.5'}`}></button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className={`p-6 ${isPopOut ? 'pb-40' : ''}`}>
          <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4 space-y-3">
                  <h2 onClick={!isPopOut ? toggleFocus : undefined} className={`${isPopOut ? 'text-4xl' : 'text-2xl'} font-black text-slate-900 tracking-tight leading-tight cursor-pointer transition-all active:opacity-70`}>{title}</h2>
                   <div className="flex items-center flex-wrap gap-2">
                      {activityTags.map(tag => (
                         <InterestTag key={tag.id} interest={tag} variant="pill" isSelected={false} onClick={() => {}} />
                      ))}
                   </div>
                   {matchingInterestsCount > 0 && isAuthenticated && (
                     <div className="inline-flex items-center space-x-2.5 px-3 py-2 bg-teal-50 rounded-xl border border-teal-100">
                        <SparklesIcon className="w-4 h-4 text-teal-600" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">Perfect Match For You</span>
                     </div>
                   )}
              </div>
              <div className="flex flex-col items-center space-y-3 flex-shrink-0">
                  <div className="relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('profile', provider); }}
                        className="block active:scale-95 transition-transform"
                    >
                        <img src={provider.avatarUrl} alt={provider.name} className={`w-16 h-16 rounded-[24px] border-4 border-white ${isPopOut ? '-mt-12' : '-mt-16'} shadow-2xl object-cover`}/>
                    </button>
                    <div className="absolute -bottom-1 -right-1">
                         <VerificationBadge level={provider.verificationLevel} />
                    </div>
                  </div>
              </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mt-6 border-b border-slate-50 pb-5">
              <div className="flex items-center space-x-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onNavigate('profile', provider); }}
                    className="text-slate-900 font-black hover:text-teal-600 transition-colors"
                  >
                    @{provider.name}
                  </button>
                  <div className="flex items-center bg-slate-100 text-slate-900 px-2 py-1 rounded-lg text-[10px] font-black border border-slate-200">
                      <StarIcon className="w-3 h-3 mr-1.5 fill-slate-900" />
                      {ratingDisplay}
                  </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleProtectedAction(() => handleFollowAction())} 
                  className={`px-5 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 border-2 ${isFollowing ? 'bg-white border-slate-100 text-slate-400' : 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10'}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button 
                  onClick={() => handleProtectedAction(() => onStartConversation(provider))} 
                  className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-teal-600 border border-slate-100 shadow-sm active:scale-90 transition-all"
                >
                    <MessageCircleIcon className="w-5 h-5"/>
                </button>
              </div>
          </div>
          
          <div className="mt-6 text-sm leading-relaxed text-slate-600 font-medium">
             <p className="whitespace-pre-line">
                {isCaptionExpanded || description.length <= CAPTION_MAX_LENGTH
                  ? description
                  : `${description.substring(0, CAPTION_MAX_LENGTH)}...`}
                {!isPopOut && description.length > CAPTION_MAX_LENGTH && (
                  <button onClick={(e) => { e.stopPropagation(); setIsCaptionExpanded(true); }} className="text-teal-600 font-black ml-1 hover:underline">
                    Show More
                  </button>
                )}
             </p>
          </div>

          {/* Quick Info Grid - High Contrast */}
          <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsDirectionsModalOpen(true); }}
                className="p-5 bg-slate-50 border-2 border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all rounded-[28px] text-left active:scale-[0.98] group"
              >
                  <div className="flex items-center text-slate-400 space-x-2 mb-1">
                      <MapPinIcon className="w-4 h-4 group-hover:text-teal-600 transition-colors"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                  </div>
                  <p className="text-[13px] font-black text-slate-900 leading-tight truncate">{location.name}</p>
              </button>

              <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-[28px]">
                  <div className="flex items-center text-slate-400 space-x-2 mb-1">
                      <CalendarIcon className="w-4 h-4"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">When</span>
                  </div>
                  <p className="text-[13px] font-black text-slate-900 leading-tight">{dateTime}</p>
              </div>

              <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-[28px]">
                  <div className="flex items-center text-slate-400 space-x-2 mb-1">
                      <UsersIcon className="w-4 h-4"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Squad</span>
                  </div>
                  <p className="text-[13px] font-black text-slate-900 leading-tight">{groupSize.min}-{groupSize.max} People</p>
              </div>

              <div className="p-5 bg-slate-50 border-2 border-slate-100 rounded-[28px]">
                  <div className="flex items-center text-slate-400 space-x-2 mb-1">
                      <CreditCardIcon className="w-4 h-4"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Cost</span>
                  </div>
                  <p className="text-[13px] font-black text-slate-900 leading-tight">{price.amount.toLocaleString()} {price.currency}</p>
              </div>
          </div>
          
          {/* Interaction Bar - High Hierarchy */}
          <div className={`mt-10 grid grid-cols-4 gap-4 ${isPopOut ? 'mb-12' : ''}`}>
             <button onClick={() => handleProtectedAction(() => handleInterestClick())} className={`flex flex-col items-center justify-center p-5 rounded-[28px] border-2 transition-all active:scale-90 ${isInterested ? 'bg-red-50 border-red-200 text-red-600 shadow-xl shadow-red-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 shadow-sm'}`}>
                <HeartIcon className={`w-7 h-7 mb-1.5 ${isInterested ? 'fill-current' : ''}`} />
                <span className="text-[9px] font-black uppercase tracking-[1.5px]">Vibe</span>
             </button>
             <button onClick={() => handleProtectedAction(() => handleSaveClick())} className={`flex flex-col items-center justify-center p-5 rounded-[28px] border-2 transition-all active:scale-90 ${isSaved ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-xl shadow-amber-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 shadow-sm'}`}>
                <BookmarkIcon className={`w-7 h-7 mb-1.5 ${isSaved ? 'fill-current' : ''}`} />
                <span className="text-[9px] font-black uppercase tracking-[1.5px]">Save</span>
             </button>
             <button onClick={() => handleProtectedAction(() => handleShareClick())} className="flex flex-col items-center justify-center p-5 rounded-[28px] bg-white border-2 border-slate-100 text-slate-400 hover:border-slate-200 shadow-sm active:scale-90 transition-all">
                <ShareIcon className="w-7 h-7 mb-1.5" />
                <span className="text-[9px] font-black uppercase tracking-[1.5px]">Share</span>
             </button>
             <button onClick={() => handleProtectedAction(() => setIsBookingModalOpen(true))} className="flex flex-col items-center justify-center p-5 rounded-[28px] bg-[#14b8a6] border-2 border-[#14b8a6] text-white shadow-2xl shadow-teal-500/30 active:scale-95 transition-all">
                <PlusCircleIcon className="w-7 h-7 mb-1.5" />
                <span className="text-[9px] font-black uppercase tracking-[1.5px]">Join</span>
             </button>
          </div>

          {(showComments || isPopOut) && (
            <div className="mt-14 space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h3 className="font-black text-2xl text-slate-900 tracking-tight">The Buzz</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{totalCommentCount} updates</span>
                </div>
                <div className="bg-slate-50 rounded-[32px] overflow-hidden border-2 border-slate-100 shadow-inner">
                    <CommentSection 
                        comments={comments}
                        onAddComment={handleAddComment}
                        onAddReply={handleAddReply}
                        onNavigate={onNavigate}
                    />
                </div>
            </div>
          )}
        </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden mb-12 transition-all duration-500 border border-slate-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] active:scale-[0.99]">
        {renderCardContent(false)}
      </div>

      {isFocused && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex flex-col items-center justify-end sm:justify-center animate-fade-in-up">
            <div className="w-full max-w-md h-[94vh] sm:h-5/6 bg-white rounded-t-[48px] sm:rounded-[48px] overflow-hidden shadow-2xl relative">
                   {renderCardContent(true)}
                   <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-lg border-t border-slate-50 flex flex-col space-y-4 p-safe-bottom z-50">
                      <button 
                        onClick={() => handleProtectedAction(() => setIsBookingModalOpen(true))}
                        className="w-full bg-slate-900 text-white font-black py-6 rounded-[28px] text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-4 group"
                      >
                         <span>{isDoundaaRequested ? 'Request Sent ✓' : "Let's Show Up!"}</span>
                         {!isDoundaaRequested && <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                      </button>
                      <button onClick={toggleFocus} className="text-xs font-black text-slate-400 uppercase tracking-widest py-2">Close Details</button>
                   </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={toggleFocus}></div>
          </div>
      )}

      <BookingForm
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={(details) => {
          setIsBookingModalOpen(false);
          setIsDoundaaRequested(true);
          setFeedbackMessage("Request sent to host!");
        }}
        activityTitle={title}
        providerName={provider.name}
        groupSize={groupSize}
        user={currentUser}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={activity.title}
        text={`Check out "${activity.title}" on Doundaa!`}
        url={`${window.location.origin}${window.location.pathname}?activityId=${activity.id}`}
        friends={mockFriends}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={() => {
          setIsReportModalOpen(false);
          setFeedbackMessage("Report submitted.");
        }}
        activityTitle={title}
      />
      <DirectionsChooserModal
        isOpen={isDirectionsModalOpen}
        onClose={() => setIsDirectionsModalOpen(false)}
        locationName={location.name}
        customUrl={location.googleMapsUrl}
      />
    </>
  );
};

export default ActivityCard;
