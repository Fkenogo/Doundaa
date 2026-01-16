
import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Provider, Comment, User, Location, Page } from '../types';
import { AwardIcon, BookmarkIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, CreditCardIcon, HeartIcon, MapPinIcon, MessageSquareIcon, ShareIcon, StarIcon, TagIcon, UsersIcon, MoreVerticalIcon, NavigationIcon, RefreshCwIcon, MessageCircleIcon, SparklesIcon } from './icons';
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
    name: 'CurrentUser', 
    avatarUrl: 'https://i.pravatar.cc/150?u=u4',
    isVerified: false,
    verificationLevel: 1
};
const CAPTION_MAX_LENGTH = 100;

const VerificationBadge: React.FC<{ level: number }> = ({ level }) => {
    if (level <= 1) {
        return (
            <div className="relative group flex items-center">
                <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">New</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs font-semibold rounded-md py-1 px-3 z-30 shadow-xl">
                    New Provider
                </div>
            </div>
        );
    }
    
    const badges: {[key: number]: { color: string; name: string; description: string }} = {
        2: { color: 'text-orange-400', name: 'Bronze Verified', description: 'Phone & Email Verified' },
        3: { color: 'text-gray-400', name: 'Silver Verified', description: 'Socials Connected' },
        4: { color: 'text-yellow-500', name: 'Gold Verified', description: 'Business Documents Verified' },
        5: { color: 'text-teal-500', name: 'Official Partner', description: 'Official Doundaa Partner' },
    };

    const badge = badges[level];

    if (!badge) return null;

    return (
        <div className="relative group flex items-center">
            <AwardIcon className={`w-4 h-4 ${badge.color}`} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs font-semibold rounded-md py-1 px-3 z-30 shadow-xl">
                {badge.name}: {badge.description}
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
  const [countUpdateKey, setCountUpdateKey] = useState(0);
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
  
  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
  };
  
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
    setCountUpdateKey(prev => prev + 1);
  };

  const handleSaveClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    showFeedback(newSavedState ? 'Doundaa saved!' : 'Removed from saved.');
  };

  const handleShareClick = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?activityId=${activity.id}`;
    
    const shareData: ShareData = {
      title: activity.title,
      text: `Join me for "${activity.title}" on Doundaa! Let's meet there.`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        setIsShareModalOpen(true);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setIsShareModalOpen(true);
      }
    }
  };

  const handleFollowAction = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isFollowing) {
      if (window.confirm(`Are you sure you want to unfollow @${provider.name}?`)) {
        const newFollowingState = false;
        setIsFollowing(newFollowingState);
        onFollowToggle(provider.id, newFollowingState);
        showFeedback(`Unfollowed @${provider.name}`);
      }
    } else {
      const newFollowingState = true;
      setIsFollowing(newFollowingState);
      onFollowToggle(provider.id, newFollowingState);
      showFeedback(`Followed @${provider.name}`);
    }
  };
  
  const handleDoundaaClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDoundaaRequested) return;
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (details: BookingDetails) => {
      setIsBookingModalOpen(false);
      setIsDoundaaRequested(true);
      showFeedback("Request sent to host!");
  };

  const handleReportSubmit = (details: ReportDetails) => {
      setIsReportModalOpen(false);
      showFeedback("Report submitted. Thank you.");
  };

  const toggleFocus = () => {
    setIsFocused(!isFocused);
    if (!isFocused) {
        setIsCaptionExpanded(true); 
    }
  };

  const handleAddComment = (text: string, attachment?: { type: 'image' | 'video', url: string }, location?: Location) => {
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

  const handleAddReply = (text: string, parentId: string, attachment?: { type: 'image' | 'video', url: string }, location?: Location) => {
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
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const toggleCaption = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCaptionExpanded(!isCaptionExpanded);
  };
  
  const ratingDisplay = provider.rating % 1 === 0 ? provider.rating : provider.rating.toFixed(1);
  
  const activityTags = interestIds.map(id => ALL_INTERESTS_MAP.get(id)).filter((i): i is NonNullable<typeof i> => !!i).slice(0, 3);

  const renderCardContent = (isPopOut: boolean) => (
    <div className={`${isPopOut ? 'bg-white h-full flex flex-col overflow-y-auto no-scrollbar' : ''}`}>
        <div className="relative group">
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white text-sm font-black px-6 py-3 rounded-2xl shadow-2xl transition-all duration-300 z-[200] ${feedbackMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
            {feedbackMessage}
          </div>

          <div 
            onClick={!isPopOut ? toggleFocus : undefined}
            className={`${isPopOut ? 'h-[50vh] min-h-[400px]' : 'h-64'} w-full bg-cover bg-center transition-all duration-700 ease-in-out cursor-pointer relative overflow-hidden`} 
            style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
          >
             {isPopOut && (
                 <button 
                    onClick={toggleFocus} 
                    className="absolute top-12 left-6 bg-white/20 backdrop-blur-xl text-white p-3 rounded-2xl border border-white/30 shadow-2xl active:scale-90 transition-transform z-50"
                 >
                    <ChevronLeftIcon className="w-6 h-6" />
                 </button>
             )}
             
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40"></div>
          </div>

          {isTimeSensitive && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl z-10 shadow-lg animate-pulse">Happening Now</span>
          )}

          {images.length > 1 && (
            <>
              <button onClick={handlePrevImage} className={`absolute ${isPopOut ? 'top-1/2' : 'top-1/2'} left-4 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl`}>
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button onClick={handleNextImage} className={`absolute ${isPopOut ? 'top-1/2' : 'top-1/2'} right-4 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl`}>
                <ChevronRightIcon className="w-6 h-6" />
              </button>
              <div className={`absolute ${isPopOut ? 'bottom-10' : 'bottom-4'} left-1/2 -translate-x-1/2 flex space-x-2 z-10`}>
                {images.map((_, index) => (
                  <button key={index} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-6 shadow-lg' : 'bg-white/40 w-1.5'}`}></button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className={`p-6 ${isPopOut ? 'pb-40' : ''}`}>
          <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                  <h2 onClick={!isPopOut ? toggleFocus : undefined} className={`${isPopOut ? 'text-3xl' : 'text-xl'} font-black text-gray-900 tracking-tight leading-tight cursor-pointer hover:text-teal-600 transition-colors`}>{title}</h2>
                   <div className="flex items-center flex-wrap gap-2 mt-3">
                      {activityTags.map(tag => (
                         <InterestTag key={tag.id} interest={tag} variant="pill" isSelected={false} onClick={() => {}} />
                      ))}
                   </div>
                   {matchingInterestsCount > 0 && isAuthenticated && (
                     <div className="mt-4 text-[11px] font-black text-teal-700 p-3 bg-teal-50/50 rounded-2xl border border-teal-100 flex items-center space-x-2">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Matches {matchingInterestsCount} of your hobbies!</span>
                     </div>
                   )}
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('profile', provider); }}
                        className="block focus:outline-none"
                    >
                        <img src={provider.avatarUrl} alt={provider.name} className={`w-14 h-14 rounded-[20px] border-4 border-white ${isPopOut ? '-mt-10' : '-mt-12'} shadow-2xl transition-transform duration-500 hover:scale-110 object-cover`}/>
                    </button>
                    <div className="absolute -bottom-1 -right-1 pointer-events-none">
                         <VerificationBadge level={provider.verificationLevel} />
                    </div>
                  </div>
                  <div className="relative">
                     <button onClick={(e) => { e.stopPropagation(); setIsOptionsMenuOpen(prev => !prev); }} className={`text-gray-400 hover:text-gray-900 ${isPopOut ? '-mt-6' : '-mt-10'} p-2`}>
                        <MoreVerticalIcon className="w-6 h-6" />
                     </button>
                     <OptionsMenu
                        isOpen={isOptionsMenuOpen}
                        onClose={() => setIsOptionsMenuOpen(false)}
                        onReport={() => handleProtectedAction(() => {
                            setIsOptionsMenuOpen(false);
                            setIsReportModalOpen(true);
                        })}
                     />
                  </div>
              </div>
          </div>

          <div className="flex items-center flex-wrap text-xs font-bold text-gray-400 mt-4 gap-4">
              <div className="flex items-center space-x-1.5">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onNavigate('profile', provider); }}
                    className="text-gray-900 font-black hover:text-teal-600 transition-colors"
                  >
                    @{provider.name}
                  </button>
                  <div className="flex items-center bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-[10px] font-black">
                      <StarIcon className="w-3 h-3 mr-1 fill-current" />
                      {ratingDisplay}
                  </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button onClick={() => handleProtectedAction(() => handleFollowAction())} className={`px-4 py-1.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${isFollowing ? 'bg-gray-100 text-gray-500' : 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'}`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button onClick={() => handleProtectedAction(() => onStartConversation(provider))} className="p-1.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors border border-gray-100">
                    <MessageCircleIcon className="w-5 h-5"/>
                </button>
              </div>
          </div>
          
          {description && (
            <div className={`mt-5 text-sm leading-relaxed text-gray-600 font-medium ${isPopOut ? 'text-base' : ''}`}>
               <p className="whitespace-pre-line">
                  {isCaptionExpanded || description.length <= CAPTION_MAX_LENGTH
                    ? description
                    : `${description.substring(0, CAPTION_MAX_LENGTH)}...`}
                  {!isPopOut && description.length > CAPTION_MAX_LENGTH && (
                    <button onClick={toggleCaption} className="text-teal-600 font-black ml-1 hover:underline">
                      Read more
                    </button>
                  )}
               </p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsDirectionsModalOpen(true); }}
                className="p-4 bg-gray-50 hover:bg-gray-100 active:scale-[0.98] transition-all rounded-[24px] border border-gray-100 space-y-1 text-left group"
              >
                  <div className="flex items-center text-gray-400 space-x-2 group-hover:text-teal-600 transition-colors">
                      <MapPinIcon className="w-4 h-4"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate">{location.name}</p>
                  <div className="text-[10px] font-black text-teal-600 uppercase flex items-center pt-1 group-hover:translate-x-1 transition-transform">
                      Get Directions <NavigationIcon className="w-3 h-3 ml-1" />
                  </div>
              </button>

              <div className="p-4 bg-gray-50 rounded-[24px] border border-gray-100 space-y-1">
                  <div className="flex items-center text-gray-400 space-x-2">
                      <CalendarIcon className="w-4 h-4"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">When</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate">{dateTime}</p>
                  {isRecurring && <span className="text-[9px] font-black text-blue-600 uppercase">Weekly</span>}
              </div>

              <div className="p-4 bg-gray-50 rounded-[24px] border border-gray-100 space-y-1">
                  <div className="flex items-center text-gray-400 space-x-2">
                      <UsersIcon className="w-4 h-4"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Squad</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900">{groupSize.min}-{groupSize.max} People</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-[24px] border border-gray-100 space-y-1">
                  <div className="flex items-center text-gray-400 space-x-2">
                      <CreditCardIcon className="w-4 h-4"/>
                      <span className="text-[10px] font-black uppercase tracking-widest">Price</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900">{price.amount.toLocaleString()} {price.currency}</p>
              </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-5">
              <div className="flex -space-x-3">
                  {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-teal-100 flex items-center justify-center text-[10px] font-black text-teal-700">+{currentInterestedCount}</div>
              </div>
              {matchCount > 0 && (
                  <div className="text-[11px] font-black text-teal-600">
                      {matchCount} active matches waiting
                  </div>
              )}
          </div>

          <div className={`mt-8 grid grid-cols-4 gap-3 ${isPopOut ? 'mb-12' : ''}`}>
             <button onClick={() => handleProtectedAction(() => handleInterestClick())} className={`flex flex-col items-center justify-center p-4 rounded-3xl border transition-all ${isInterested ? 'bg-red-50 border-red-100 text-red-600 shadow-xl shadow-red-500/10' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}>
                <HeartIcon className={`w-6 h-6 mb-1 ${isInterested ? 'fill-current' : ''}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">Vibe</span>
             </button>
             <button onClick={() => handleProtectedAction(() => handleSaveClick())} className={`flex flex-col items-center justify-center p-4 rounded-3xl border transition-all ${isSaved ? 'bg-amber-50 border-amber-100 text-amber-600 shadow-xl shadow-amber-500/10' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'}`}>
                <BookmarkIcon className={`w-6 h-6 mb-1 ${isSaved ? 'fill-current' : ''}`} />
                <span className="text-[9px] font-black uppercase tracking-widest">Save</span>
             </button>
             <button onClick={() => handleProtectedAction(() => handleShareClick())} className="flex flex-col items-center justify-center p-4 rounded-3xl bg-gray-50 border border-gray-100 text-gray-400 hover:bg-gray-100 transition-all">
                <ShareIcon className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-black uppercase tracking-widest">Share</span>
             </button>
             <button onClick={() => handleProtectedAction(() => handleDoundaaClick())} className="flex flex-col items-center justify-center p-4 rounded-3xl bg-teal-600 border border-teal-500 text-white shadow-xl shadow-teal-600/30 hover:bg-teal-700 active:scale-95 transition-all">
                <CreditCardIcon className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-black uppercase tracking-widest">Doundaa</span>
             </button>
          </div>

          {(showComments || isPopOut) && (
            <div className="mt-12 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-gray-900 tracking-tight">Activity Buzz</h3>
                    <span className="text-xs font-bold text-gray-400">{totalCommentCount} comments</span>
                </div>
                <div className="bg-gray-50 rounded-[32px] overflow-hidden border border-gray-100 shadow-inner">
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
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden mb-10 transition-all duration-500 group border border-gray-100 hover:shadow-teal-900/5">
        {renderCardContent(false)}
      </div>

      {isFocused && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex flex-col items-center justify-end sm:justify-center p-0 sm:p-6 animate-fade-in-up">
            <div className="w-full max-w-md h-[92vh] sm:h-5/6 bg-white rounded-t-[48px] sm:rounded-[48px] overflow-hidden shadow-2xl relative">
                   {renderCardContent(true)}
                   {/* High-fidelity sticky footer for the primary action */}
                   <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-md border-t border-gray-50 flex items-center justify-center p-safe-bottom z-50">
                      <button 
                        onClick={() => handleProtectedAction(() => handleDoundaaClick())}
                        className="w-full bg-[#111827] text-white font-black py-5 px-6 rounded-[24px] text-lg shadow-[0_15px_30px_rgba(0,0,0,0.2)] active:scale-95 transition-all hover:bg-black group flex items-center justify-center space-x-3"
                      >
                         <span>{isDoundaaRequested ? 'Request Sent ✓' : 'Let\'s Meet There'}</span>
                         {!isDoundaaRequested && <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                      </button>
                   </div>
            </div>
            {/* Click backdrop to close */}
            <div className="absolute inset-0 -z-10" onClick={toggleFocus}></div>
          </div>
      )}

      <BookingForm
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
        activityTitle={title}
        providerName={provider.name}
        groupSize={groupSize}
        user={currentUser}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={activity.title}
        text={`Check out "${activity.title}" by ${provider.name} on Doundaa!`}
        url={`${window.location.origin}${window.location.pathname}?activityId=${activity.id}`}
        friends={mockFriends}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
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
