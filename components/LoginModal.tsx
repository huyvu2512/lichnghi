import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const { login } = useAuth();
  const signInDivRef = useRef<HTMLDivElement>(null);

  const handleSuccessfulLogin = useCallback((response: any) => {
    login(response.credential);
    onClose();
  }, [login, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    if (typeof google !== 'undefined') {
        // Initialize Google Identity Services
        google.accounts.id.initialize({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // IMPORTANT: Replace with your actual Google Client ID
            callback: handleSuccessfulLogin
        });
        
        // Render the Google Sign-In button
        if (signInDivRef.current) {
            signInDivRef.current.innerHTML = ''; // Clear previous button
            google.accounts.id.renderButton(
                signInDivRef.current,
                { theme: "outline", size: "large", type: "standard", text: "signin_with", shape: "rectangular", logo_alignment: "left" }
            );
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleSuccessfulLogin, onClose]);


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
          {/* NOTE: This form is for UI purposes only and is not functional without a backend */}
          <form onSubmit={e => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3zm0 2h14v1.586l-7 7L3 7.586V6z" /></svg>
                 </div>
                 <input type="email" id="email" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Email" />
              </div>
            </div>
             <div>
               <label htmlFor="password" className="sr-only">Password</label>
               <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  </div>
                  <input type="password" id="password" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="••••••••••" />
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
          
          <div ref={signInDivRef} className="flex justify-center"></div>

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