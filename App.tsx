import React, { useState, useEffect } from 'react';
import DiscoveryPage from './components/pages/DiscoveryPage';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import CreatePostPage from './components/pages/CreatePostPage';
import ChatPage from './components/pages/ChatPage';
import AuthPage from './components/pages/AuthPage';
import OnboardingPage, { OnboardingData } from './components/pages/OnboardingPage';
import ProfilePage from './components/pages/ProfilePage';
import AdminPage from './components/pages/AdminPage';
import WelcomePage from './components/pages/WelcomePage';
import MatchesPage from './components/pages/MatchesPage';
import InterestsPage from './components/pages/InterestsPage';
import { Page, Conversation, Provider, Message, User } from './types';
import { mockConversations, currentUser as initialUser } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  // Add a new state to track if the welcome screen has been seen.
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>(hasSeenWelcome ? 'auth' : 'welcome');
  const [pageState, setPageState] = useState<object | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    const totalUnread = conversations.reduce((acc, curr) => acc + curr.unreadCount, 0);
    setHasUnreadMessages(totalUnread > 0);
  }, [conversations]);

  const navigate = (page: Page, state?: object) => {
    setCurrentPage(page);
    setPageState(state || null);
  };
  
  const handleWelcomeComplete = () => {
    setHasSeenWelcome(true);
    navigate('auth');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Simulate fetching user data but without interests initially
    const userWithoutInterests = { ...initialUser, interestIds: [] };
    setCurrentUser(initialUser); // Use full user for matching demo
    
    // In a real app, you'd check a flag from your backend
    if (!hasCompletedOnboarding) {
        navigate('onboarding');
    } else {
        navigate('discover');
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setCurrentUser(prev => prev ? { 
        ...prev, 
        name: data.profile.name,
        username: data.profile.username,
        avatarUrl: data.profile.avatarUrl,
        bio: data.profile.bio,
        interestIds: data.interests,
        discoveryMode: data.discoveryMode,
    } : null);
    setHasCompletedOnboarding(true);
    navigate('discover');
  };
  
  const updateUserInterests = (newInterestIds: string[]) => {
      if (currentUser) {
          setCurrentUser({
              ...currentUser,
              interestIds: Array.from(new Set([...currentUser.interestIds || [], ...newInterestIds]))
          });
      }
  };

  const handleContinueAsGuest = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setHasSeenWelcome(true); // So they don't see it again if they navigate back
    navigate('discover');
  };
  
  const requestAuth = () => {
    navigate('auth');
  };

  const handleSendMessage = (conversationId: string, message: Message) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c
      )
    );
  };
  
  const findOrCreateConversation = (provider: Provider): string => {
    if (!currentUser) return '';
    const existingConversation = conversations.find(c => c.participants.some(p => p.id === provider.id));
    if (existingConversation) {
      return existingConversation.id;
    } else {
      const newConversation: Conversation = {
        id: `conv_${provider.id}`,
        participants: [currentUser, provider as User],
        messages: [],
        unreadCount: 0,
      };
      setConversations(prev => [newConversation, ...prev]);
      return newConversation.id;
    }
  };

  const handleStartConversation = (provider: Provider) => {
      const conversationId = findOrCreateConversation(provider);
      if(conversationId) {
        navigate('messages', { activeConversationId: conversationId });
      }
  };
  
  const handleMarkAsRead = (conversationId: string) => {
    setConversations(prev => 
        prev.map(c => 
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
        )
    );
  };

  const renderPage = () => {
    const userInterests = currentUser?.interestIds || [];
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onGetStarted={handleWelcomeComplete} />;
      case 'discover':
        return <DiscoveryPage onNavigate={navigate} onStartConversation={handleStartConversation} isAuthenticated={isAuthenticated} onRequestAuth={requestAuth} userInterests={userInterests} currentUser={currentUser} />;
      case 'matches':
        return <MatchesPage currentUser={currentUser} />;
      case 'interests':
        return <InterestsPage currentUser={currentUser} onUpdateInterests={updateUserInterests} />;
      case 'createPost':
        return <CreatePostPage onPostCreated={() => navigate('discover')} />;
      case 'messages':
        return (
          <ChatPage
            conversations={conversations}
            onSendMessage={handleSendMessage}
            onMarkAsRead={handleMarkAsRead}
            initialConversationId={(pageState as any)?.activeConversationId}
          />
        );
      case 'auth':
        return <AuthPage onLoginSuccess={handleLoginSuccess} onContinueAsGuest={handleContinueAsGuest} />;
      case 'onboarding':
        return <OnboardingPage onOnboardingComplete={handleOnboardingComplete} initialUser={currentUser} />;
      case 'profile':
        return currentUser ? <ProfilePage user={currentUser} onNavigate={navigate}/> : <DiscoveryPage onNavigate={navigate} onStartConversation={handleStartConversation} isAuthenticated={isAuthenticated} onRequestAuth={requestAuth} userInterests={userInterests} currentUser={currentUser} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <DiscoveryPage onNavigate={navigate} onStartConversation={handleStartConversation} isAuthenticated={isAuthenticated} onRequestAuth={requestAuth} userInterests={userInterests} currentUser={currentUser} />;
    }
  }
  
  const showNavAndHeader = currentPage !== 'auth' && currentPage !== 'onboarding' && currentPage !== 'welcome';

  return (
    <div className="bg-gray-50 min-h-screen">
       {showNavAndHeader && (
         <>
          <Header onLogoClick={() => navigate('discover')} onProfileClick={() => isAuthenticated ? navigate('profile') : requestAuth()} hasNotifications={hasUnreadMessages} avatarUrl={currentUser?.avatarUrl} />
          <main className="pt-16 pb-20">
            {renderPage()}
          </main>
          <BottomNav activePage={currentPage} navigate={navigate} hasUnreadMessages={hasUnreadMessages} isAuthenticated={isAuthenticated} onRequestAuth={requestAuth} />
         </>
       )}
       {!showNavAndHeader && renderPage()}
    </div>
  );
};

export default App;