
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DiscoveryPage from './components/pages/DiscoveryPage';
import MatchesPage from './components/pages/MatchesPage';
import ChatPage from './components/pages/ChatPage';
import InterestsPage from './components/pages/InterestsPage';
import ProfilePage from './components/pages/ProfilePage';
import CreatePostPage from './components/pages/CreatePostPage';
import WelcomePage from './components/pages/WelcomePage';
import AuthPage from './components/pages/AuthPage';
import OnboardingPage, { OnboardingData } from './components/pages/OnboardingPage';
import AdminPage from './components/pages/AdminPage';
import { Page, User, Conversation, Message, Provider } from './types';
import { currentUser as mockUser, mockConversations } from './constants';

const App: React.FC = () => {
  // --- AUTH & ONBOARDING STATE ---
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // --- NAVIGATION STATE ---
  const [currentPage, setCurrentPage] = useState<Page>('discover');
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const [viewingProfileUser, setViewingProfileUser] = useState<User | Provider | null>(null);

  // --- CHAT STATE ---
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  const hasUnreadMessages = conversations.some(c => c.unreadCount > 0);

  // --- HANDLERS ---
  const handleOnboardingComplete = (data: OnboardingData) => {
    const newUser: User = {
      id: 'u_new',
      name: data.profile.name,
      username: data.profile.username,
      avatarUrl: data.profile.avatarUrl || 'https://picsum.photos/seed/default/100/100',
      bio: data.profile.bio,
      interestIds: data.interests,
      discoveryMode: data.discoveryMode,
      isVerified: false,
      verificationLevel: 1,
      activityHistory: { attended: [] },
      viewedActivities: [],
    };
    setUser(newUser);
    setHasCompletedOnboarding(true);
    setCurrentPage('discover');
  };

  const handleStartConversation = (provider: Provider | User) => {
    const existing = conversations.find(c => c.participants.some(p => p.id === provider.id));
    if (existing) {
      setActiveConversationId(existing.id);
    } else {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participants: [user || mockUser, provider],
        messages: [],
        unreadCount: 0
      };
      setConversations([newConv, ...conversations]);
      setActiveConversationId(newConv.id);
    }
    setCurrentPage('messages');
  };

  const handleSendMessage = (conversationId: string, message: Message) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
    ));
  };

  const handleMarkAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
    ));
  };

  const navigate = (page: Page, profileUser?: User | Provider) => {
    if (page === 'profile') {
        setViewingProfileUser(profileUser || null);
    } else {
        setViewingProfileUser(null);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // --- RENDER LOGIC ---

  if (showWelcome) return <WelcomePage onGetStarted={() => setShowWelcome(false)} />;
  if (!isAuthenticated) return <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} onContinueAsGuest={() => setIsAuthenticated(true)} />;
  if (!hasCompletedOnboarding) return <OnboardingPage initialUser={user} onOnboardingComplete={handleOnboardingComplete} />;

  const renderContent = () => {
    switch (currentPage) {
      case 'discover':
        return (
          <DiscoveryPage 
            onNavigate={navigate} 
            onStartConversation={handleStartConversation}
            isAuthenticated={isAuthenticated}
            onRequestAuth={() => setIsAuthenticated(false)}
            userInterests={user?.interestIds || mockUser.interestIds || []}
            currentUser={user || mockUser}
          />
        );
      case 'matches':
        return <MatchesPage currentUser={user || mockUser} onNavigate={navigate} />;
      case 'messages':
        return (
          <ChatPage 
            conversations={conversations} 
            onSendMessage={handleSendMessage} 
            onMarkAsRead={handleMarkAsRead}
            initialConversationId={activeConversationId}
            onNavigate={navigate}
          />
        );
      case 'interests':
        return (
          <InterestsPage 
            currentUser={user || mockUser} 
            onUpdateInterests={(ids) => setUser(prev => prev ? { ...prev, interestIds: ids } : null)}
          />
        );
      case 'profile':
        const targetUser = viewingProfileUser || user || mockUser;
        const isOwn = !viewingProfileUser || viewingProfileUser.id === (user?.id || mockUser.id);
        return (
          <ProfilePage 
            user={targetUser as User} 
            isOwnProfile={isOwn}
            onNavigate={navigate}
            onUpdateProfile={(data) => setUser(prev => prev ? { ...prev, ...data } : null)}
            onStartConversation={handleStartConversation}
          />
        );
      case 'createPost':
        return <CreatePostPage onPostCreated={() => navigate('discover')} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DiscoveryPage onNavigate={navigate} onStartConversation={handleStartConversation} isAuthenticated={isAuthenticated} onRequestAuth={() => {}} userInterests={[]} currentUser={null} />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-[100dvh] flex flex-col bg-white shadow-2xl relative overflow-hidden">
      {currentPage !== 'admin' && (
        <Header 
          onLogoClick={() => navigate('discover')} 
          onProfileClick={() => navigate('profile')}
          hasNotifications={hasUnreadMessages}
          avatarUrl={user?.avatarUrl || mockUser.avatarUrl}
        />
      )}
      
      <main className={`flex-1 overflow-y-auto no-scrollbar ${currentPage !== 'admin' ? 'pt-16 pb-20' : ''}`}>
        {renderContent()}
      </main>

      {currentPage !== 'admin' && (
        <BottomNav 
          activePage={currentPage} 
          navigate={navigate} 
          hasUnreadMessages={hasUnreadMessages}
          isAuthenticated={isAuthenticated}
          onRequestAuth={() => setIsAuthenticated(false)}
        />
      )}
    </div>
  );
};

export default App;
