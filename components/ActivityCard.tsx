import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Provider, Comment, User, Location } from '../types';
import { AwardIcon, BookmarkIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, CreditCardIcon, HeartIcon, MapPinIcon, MessageSquareIcon, ShareIcon, StarIcon, TagIcon, UsersIcon, MoreVerticalIcon, NavigationIcon, RefreshCwIcon, MessageCircleIcon } from './icons';
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
  isAuthenticated: boolean;
  onRequestAuth: () => void;
  userInterests: string[];
}

const currentUser: User = { id: 'u4', name: 'CurrentUser', avatarUrl: 'https://picsum.photos/seed/current-user/50/50' };
const CAPTION_MAX_LENGTH = 100;

const VerificationBadge: React.FC<{ level: number }> = ({ level }) => {
    if (level <= 1) {
        return (
            <div className="relative group flex items-center">
                <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">New</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs font-semibold rounded-md py-1 px-3 z-30">
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
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs font-semibold rounded-md py-1 px-3 z-30">
                {badge.name}: {badge.description}
            </div>
        </div>
    );
};


const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onFollowToggle, onStartConversation, isAuthenticated, onRequestAuth, userInterests }) => {
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

  const handleInterestClick = () => {
    const newInterestedState = !isInterested;
    setIsInterested(newInterestedState);
    setCurrentInterestedCount(current => newInterestedState ? current + 1 : current - 1);
    setCountUpdateKey(prev => prev + 1);
  };

  const handleSaveClick = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    showFeedback(newSavedState ? 'Doundaa saved!' : 'Removed from saved.');
  };

  const handleShareClick = async () => {
    const activityUrl = `${window.location.href.split('?')[0]}activity/${activity.id}`;
    const shareData = {
      title: activity.title,
      text: `Check out "${activity.title}" by ${provider.name} on Doundaa!`,
      url: activityUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      setIsShareModalOpen(true);
    }
  };

  const handleFollowAction = () => {
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
  
  const handleDoundaaClick = () => {
    if (isDoundaaRequested) return;
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (details: BookingDetails) => {
    console.log("Doundaa Inquiry Submitted:", { activityId: activity.id, ...details });
    setIsBookingModalOpen(false);
    setIsDoundaaRequested(true);
    showFeedback('Doundaa request sent!');
  };

  const handleReportSubmit = (details: ReportDetails) => {
    console.log("Activity Reported:", { activityId: activity.id, ...details });
    setIsReportModalOpen(false);
    showFeedback('Report submitted. Thank you for your feedback.');
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

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">
        <div className="relative group">
          
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white text-sm px-4 py-2 rounded-full transition-all duration-300 z-20 ${feedbackMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            {feedbackMessage}
          </div>

          <div 
            className="h-60 bg-cover bg-center transition-all duration-500 ease-in-out" 
            style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
          ></div>

          {isTimeSensitive && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">Happening Now</span>
          )}

          {images.length > 1 && (
            <>
              <button onClick={handlePrevImage} aria-label="Previous image" className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-800 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 focus:outline-none">
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button onClick={handleNextImage} aria-label="Next image" className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/60 hover:bg-white text-gray-800 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 focus:outline-none">
                <ChevronRightIcon className="w-6 h-6" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                {images.map((_, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} aria-label={`Go to image ${index + 1}`} className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}></button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-xl font-bold text-gray-900 mt-1">{title}</h2>
                   <div className="flex items-center flex-wrap gap-2 mt-2">
                      {activityTags.map(tag => (
                         <InterestTag key={tag.id} interest={tag} variant="pill" isSelected={false} onClick={() => {}} />
                      ))}
                   </div>
                   {matchingInterestsCount > 0 && isAuthenticated && (
                     <div className="mt-2 text-sm font-semibold text-teal-700 p-2 bg-teal-50 rounded-lg">
                        ✨ {matchingInterestsCount} of your interests
                        {matchingInterestsCount >=3 && <span className="ml-2 font-bold">💚 Great match for you!</span>}
                     </div>
                   )}
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                  <img src={provider.avatarUrl} alt={provider.name} className="w-12 h-12 rounded-full border-2 border-white -mt-10 shadow-md transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-teal-400"/>
                  <div className="relative">
                     <button onClick={() => setIsOptionsMenuOpen(prev => !prev)} aria-label="More options" className="text-gray-500 hover:text-gray-800 -mt-8">
                        <MoreVerticalIcon className="w-5 h-5" />
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
          <div className="flex items-center flex-wrap text-sm text-gray-500 mt-2 gap-x-3 gap-y-1">
              <div className="relative group">
                  <span>by @{provider.name}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs font-semibold rounded-md py-1 px-3 z-30">
                      {provider.name}
                  </div>
              </div>
              <VerificationBadge level={provider.verificationLevel} />
              <div className="relative group flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold text-gray-700">{ratingDisplay}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs font-semibold rounded-md py-1 px-3 z-30">
                      {provider.rating.toFixed(1)} stars
                  </div>
              </div>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <button onClick={() => handleProtectedAction(handleFollowAction)} aria-label={isFollowing ? `Unfollow @${provider.name}` : `Follow @${provider.name}`} className={`text-xs font-semibold py-1 px-3 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105 ${isFollowing ? 'bg-gray-200 text-gray-600' : 'bg-teal-500 text-white hover:bg-teal-600'}`}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
            <button onClick={() => handleProtectedAction(() => onStartConversation(provider))} aria-label={`Message @${provider.name}`} className="flex items-center text-xs font-semibold py-1 px-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105">
                <MessageCircleIcon className="w-4 h-4 mr-1.5"/>
                Message
            </button>
          </div>
          
          {description && (
            <div className="mt-3 text-sm text-gray-800">
              <p className="whitespace-pre-line">
                <span className="font-bold text-gray-900 cursor-pointer hover:underline">{provider.name}</span>{' '}
                <span>
                  {isCaptionExpanded || description.length <= CAPTION_MAX_LENGTH
                    ? description
                    : `${description.substring(0, CAPTION_MAX_LENGTH)}...`}
                  {description.length > CAPTION_MAX_LENGTH && (
                    <button onClick={toggleCaption} className="text-gray-500 font-semibold hover:text-gray-800 ml-1">
                      {isCaptionExpanded ? 'less' : 'more'}
                    </button>
                  )}
                </span>
              </p>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-gray-700">
              <div className="flex items-start">
                  <MapPinIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5"/>
                  <div className="flex-1 min-w-0">
                    <span className="truncate font-medium">{location.name} • {distance}km</span>
                    {location.description && <p className="text-xs text-gray-500 truncate">{location.description}</p>}
                  </div>
                   <button 
                      onClick={() => setIsDirectionsModalOpen(true)}
                      aria-label={`Get directions to ${location.name}`}
                      className="ml-2 p-1 rounded-full hover:bg-gray-100 text-teal-600 flex-shrink-0"
                  >
                      <NavigationIcon className="w-4 h-4"/>
                  </button>
              </div>
              <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2 text-gray-400"/>
                  <span>{dateTime}</span>
                  {isRecurring && (
                      <div className="relative group">
                          <RefreshCwIcon className="w-4 h-4 ml-2 text-gray-500"/>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max hidden group-hover:block bg-gray-800 text-white text-xs font-semibold rounded-md py-1 px-3 z-30">
                              Recurring Doundaa
                          </div>
                      </div>
                  )}
              </div>
              <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 mr-2 text-gray-400"/>
                  <span>{groupSize.min}-{groupSize.max} people</span>
              </div>
              <div className="flex items-center font-semibold">
                  <span>approx. {price.amount.toLocaleString()} {price.currency}</span>
              </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 border-t pt-3">
              <div className="flex items-center font-semibold">
                  <HeartIcon className={`w-5 h-5 mr-1.5 transition-colors ${isInterested ? 'text-red-500 fill-current' : 'text-red-500'}`}/>
                  <span key={countUpdateKey} className={`inline-block ${countUpdateKey > 0 ? 'animate-count-update' : ''}`}>{currentInterestedCount}</span>
                  <span className="ml-1">interested</span>
              </div>
              {matchCount > 0 && (
                  <div className="flex items-center font-semibold text-teal-700">
                      <UsersIcon className="w-5 h-5 mr-1.5"/>
                      <span>{matchCount} matched</span>
                  </div>
              )}
          </div>
        </div>

        <div className="bg-gray-50 grid grid-cols-5 border-t">
          <button onClick={() => handleProtectedAction(handleInterestClick)} aria-label={isInterested ? "Remove interest" : "Show interest"} className={`flex flex-col items-center justify-center py-3 text-xs font-bold transition-colors ${isInterested ? 'text-red-600' : 'text-gray-700 hover:bg-red-50'}`}>
              <HeartIcon className={`w-5 h-5 mb-1 transition-all ${isInterested ? 'fill-current' : ''}`}/>
              Interested
          </button>
           <button onClick={() => handleProtectedAction(() => setShowComments(!showComments))} aria-label="View comments" className="flex flex-col items-center justify-center py-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 border-l transition-colors">
              <MessageSquareIcon className="w-5 h-5 mb-1"/>
              {totalCommentCount > 0 ? `${totalCommentCount} Comments` : 'Comment'}
          </button>
          <button onClick={() => handleProtectedAction(handleSaveClick)} aria-label={isSaved ? 'Remove from saved' : 'Save this doundaa'} className="flex flex-col items-center justify-center py-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 border-l transition-colors">
              <BookmarkIcon className={`w-5 h-5 mb-1 transition-all ${isSaved ? 'text-teal-600 fill-current' : 'text-gray-600'}`}/>
              {isSaved ? 'Saved' : 'Save'}
          </button>
          <button onClick={handleShareClick} aria-label="Share this doundaa" className="flex flex-col items-center justify-center py-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 border-l transition-colors">
              <ShareIcon className="w-5 h-5 mb-1"/>
              Share
          </button>
          <button
              onClick={() => handleProtectedAction(handleDoundaaClick)}
              aria-label={isDoundaaRequested ? 'Doundaa request sent' : 'Doundaa this activity'}
              disabled={isDoundaaRequested}
              className={`flex flex-col items-center justify-center py-3 text-xs font-bold transition-colors border-l ${isDoundaaRequested ? 'text-gray-500 bg-gray-100 cursor-not-allowed' : 'text-teal-600 hover:bg-teal-50'}`}
          >
              <CreditCardIcon className="w-5 h-5 mb-1"/>
              {isDoundaaRequested ? 'Requested' : 'Doundaa'}
          </button>
        </div>

        {showComments && (
          <CommentSection 
              comments={comments}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
          />
        )}
      </div>
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
        url={`${window.location.href.split('?')[0]}activity/${activity.id}`}
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
      />
    </>
  );
};

export default ActivityCard;