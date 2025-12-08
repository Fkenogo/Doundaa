import React, { useState } from 'react';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onContinueAsGuest: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onContinueAsGuest }) => {
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${authMode} attempt with phone:`, { phone });
    // Here you would typically trigger SMS verification
    onLoginSuccess();
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => (prev === 'signup' ? 'signin' : 'signup'));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-800 tracking-tight">Doundaa</h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            {authMode === 'signup' ? 'Create Your Account' : 'Sign in to Doundaa'}
          </h2>
        </div>
        
        <div className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Sign up with Google</span>
                    G
                </button>
                 <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Sign up with Facebook</span>
                    f
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">or sign up with</span>
                </div>
            </div>

             <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="phone-number" className="sr-only">Phone Number</label>
                <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <span className="text-gray-500 sm:text-sm">+250</span>
                     </div>
                     <input
                        id="phone-number"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="appearance-none block w-full px-3 py-3 pl-14 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                        placeholder="7XX XXX XXX"
                    />
                </div>
              </div>
              <p className="mt-2 text-xs text-center text-gray-500">
                By continuing, you agree to our <a href="#" className="font-medium text-gray-700 hover:underline">Terms & Privacy Policy</a>
              </p>
              <button
                type="submit"
                className="mt-4 group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Continue →
              </button>
            </form>
        </div>


        <div className="text-center">
            <p className="text-sm">
                <button onClick={toggleAuthMode} className="font-medium text-teal-600 hover:text-teal-500">
                    {authMode === 'signup' ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;