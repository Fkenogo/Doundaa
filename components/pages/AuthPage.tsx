
import React, { useState } from 'react';
import { ChevronLeftIcon, CheckCircleIcon } from '../icons';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onContinueAsGuest: () => void;
}

type AuthMode = 'signup' | 'signin' | 'reset';

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onContinueAsGuest }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetIdentity, setResetIdentity] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      console.log(`${authMode} attempt:`, { phone, password });
      onLoginSuccess();
    }, 1000);
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetStep(2);
    }, 1200);
  };

  const handleResetComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('signin');
      setResetStep(1);
      alert('Password reset successfully! Please sign in with your new password.');
    }, 1500);
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => (prev === 'signup' ? 'signin' : 'signup'));
  };

  const renderHeader = () => {
    if (authMode === 'reset') {
      return (
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {resetStep === 1 ? 'Reset Password' : 'Create New Password'}
          </h2>
          <p className="text-sm font-medium text-gray-500">
            {resetStep === 1 
              ? "Enter your email or phone to receive a code." 
              : "Verify your identity and set a new password."}
          </p>
        </div>
      );
    }
    return (
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Doundaa</h1>
        <h2 className="text-2xl font-bold text-gray-900">
          {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h2>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
        {renderHeader()}
        
        <div className="space-y-6">
          {(authMode === 'signup' || authMode === 'signin') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <span className="mr-2">G</span> Google
                </button>
                <button className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  <span className="mr-2 text-blue-600 font-black">f</span> Facebook
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                  <span className="px-4 bg-gray-50 text-gray-400">or continue with</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-bold text-sm">+250</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-14 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm font-bold transition-all"
                      placeholder="7XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                    {authMode === 'signin' && (
                      <button 
                        type="button"
                        onClick={() => setAuthMode('reset')}
                        className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm font-bold transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-600 text-white font-black py-4 rounded-xl shadow-xl shadow-teal-600/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    authMode === 'signup' ? 'Create Account' : 'Sign In'
                  )}
                </button>
              </form>
            </>
          )}

          {authMode === 'reset' && (
            <div className="space-y-6">
              {resetStep === 1 ? (
                <form onSubmit={handleResetRequest} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email or Phone</label>
                    <input
                      type="text"
                      required
                      value={resetIdentity}
                      onChange={e => setResetIdentity(e.target.value)}
                      placeholder="e.g. chris@doundaa.rw"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm font-bold transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 text-white font-black py-4 rounded-xl shadow-xl active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetComplete} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">6-Digit Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-center text-xl font-black tracking-[10px] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 text-sm font-bold transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-600 text-white font-black py-4 rounded-xl shadow-xl shadow-teal-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}
              
              <button 
                onClick={() => { setAuthMode('signin'); setResetStep(1); }}
                className="w-full flex items-center justify-center space-x-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>
            </div>
          )}
        </div>

        {authMode !== 'reset' && (
          <div className="text-center space-y-4">
            <button 
              onClick={toggleAuthMode} 
              className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
            >
              {authMode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
            
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
              By continuing, you agree to our <br />
              <a href="#" className="text-gray-900 underline">Terms of Service</a> and <a href="#" className="text-gray-900 underline">Privacy Policy</a>
            </p>

            <div className="pt-4">
              <button 
                onClick={onContinueAsGuest}
                className="text-xs font-black text-gray-400 uppercase tracking-[2px] hover:text-gray-600 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
