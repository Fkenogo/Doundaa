
import React, { useState } from 'react';
import { ChevronLeftIcon } from '../icons';

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
  const [resetIdentity, setResetIdentity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1200);
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => (prev === 'signup' ? 'signin' : 'signup'));
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col overflow-y-auto no-scrollbar p-6">
      <div className="w-full max-w-sm mx-auto bg-white rounded-[48px] shadow-2xl p-10 border border-slate-100 flex flex-col items-center my-auto">
        
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-10 w-full">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Doundaa</h1>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
        </div>
        
        <div className="w-full space-y-8">
          {authMode !== 'reset' ? (
            <>
              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center py-4 px-4 border border-slate-200 rounded-[22px] bg-white text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                  <span className="mr-3 text-lg group-hover:scale-110 transition-transform">G</span> 
                  <span>Google</span>
                </button>
                <button className="flex items-center justify-center py-4 px-4 border border-slate-200 rounded-[22px] bg-white text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95 group">
                  <span className="mr-3 text-blue-600 text-xl group-hover:scale-110 transition-transform">f</span> 
                  <span>Facebook</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[2.5px]">
                  <span className="px-5 bg-white text-slate-400">or continue with</span>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2.5">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[20px] text-base font-bold text-slate-900 transition-all placeholder:text-slate-300 shadow-sm focus-ring"
                    placeholder="+250 7..."
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[20px] text-base font-bold text-slate-900 transition-all placeholder:text-slate-300 shadow-sm focus-ring"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#14b8a6] text-white font-black py-5 rounded-[24px] shadow-xl shadow-teal-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center text-lg mt-4 group"
                >
                  {isLoading ? (
                    <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>{authMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-6">
                <form onSubmit={(e) => { e.preventDefault(); setResetStep(2); }} className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Email or Phone</label>
                    <input
                      type="text"
                      required
                      value={resetIdentity}
                      onChange={e => setResetIdentity(e.target.value)}
                      placeholder="e.g. kigali@doundaa.rw"
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[20px] text-base font-bold text-slate-900 shadow-sm focus-ring"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] shadow-xl active:scale-95 transition-all text-lg"
                  >
                    Send Reset Code
                  </button>
                </form>
            </div>
          )}

          {/* Footer Actions */}
          <div className="text-center space-y-6 mt-6">
            <button 
              onClick={toggleAuthMode} 
              className="text-sm font-black text-[#14b8a6] hover:underline transition-all"
            >
              {authMode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
            
            <div className="pt-4 border-t border-slate-50 space-y-4">
              <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wider">
                By continuing, you agree to our <br />
                <a href="#" className="text-slate-900 underline underline-offset-4 decoration-slate-200 hover:decoration-teal-500 transition-all">Terms of Service</a> and <a href="#" className="text-slate-900 underline underline-offset-4 decoration-slate-200 hover:decoration-teal-500 transition-all">Privacy Policy</a>
              </p>

              <button 
                onClick={onContinueAsGuest}
                className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] hover:text-gray-900 transition-colors py-2 block w-full"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Spacer for bottom safe areas/extra breathing room */}
      <div className="h-10 shrink-0"></div>
    </div>
  );
};

export default AuthPage;
