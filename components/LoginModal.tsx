import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

// Declare google object from the GSI script
declare const google: any;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const { login, loginWithGoogle } = useAuth();
  
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    loginWithGoogle();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Hardcoded credentials check
    if (emailOrUsername === 'huyvu2512' && password === 'luczaiam2512') {
      const mockUser = {
        name: 'Huy Vu',
        email: 'quanghuy25121995@gmail.com',
        // Using a placeholder avatar API for a nice touch
        picture: `https://ui-avatars.com/api/?name=Huy+Vu&background=818cf8&color=fff`,
      };
      
      // Create a fake JWT payload and encode it for the login function
      const payload = btoa(JSON.stringify(mockUser));
      const mockCredential = `mock.${payload}.mock`;
      
      login(mockCredential);
      onClose();
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng.');
    }
  };


  useEffect(() => {
    if (!isOpen) return;
    
    // Reset form on open
    setEmailOrUsername('');
    setPassword('');
    setError(null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-bold text-xl text-gray-800">Đăng nhập</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="emailOrUsername" className="sr-only">Email or Username</label>
              <div className="relative">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                 </div>
                 <input 
                    type="text" 
                    id="emailOrUsername" 
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Email hoặc Tài khoản" 
                    required
                 />
              </div>
            </div>
             <div>
               <label htmlFor="password" className="sr-only">Password</label>
               <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  </div>
                  <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="••••••••••" 
                    required
                   />
               </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Ghi nhớ đăng nhập</label>
                </div>
                <div className="text-sm">
                    <button type="button" onClick={onSwitchToForgotPassword} className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">Quên mật khẩu?</button>
                </div>
            </div>
            
            {error && <p className="text-sm text-red-600 text-center -mb-2">{error}</p>}

            <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                Đăng nhập
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">HOẶC</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.35 6.48C12.73 13.72 17.94 9.5 24 9.5z"></path>
                <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h13.04c-.58 2.77-2.27 5.17-4.81 6.84l8.35 6.48c4.87-4.49 7.82-11.01 7.82-18.28z"></path>
                <path fill="#FBBC05" d="M10.91 28.19c-.39-1.18-.6-2.43-.6-3.71s.21-2.53.6-3.71l-8.35-6.48C.73 16.51 0 20.14 0 24s.73 7.49 2.56 10.29l8.35-6.1z"></path>
                <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-8.35-6.48c-2.11 1.41-4.8 2.26-7.54 2.26-6.06 0-11.27-4.22-13.09-9.92l-8.35 6.48C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Đăng nhập với Google
          </button>


          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <button type="button" onClick={onSwitchToRegister} className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
              Đăng ký
            </button>
          </p>

        </div>
      </div>
       <style>{`
          @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; }}
          @keyframes scale-in { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); }}
          .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
          .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default LoginModal;