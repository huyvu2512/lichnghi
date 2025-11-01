import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import UserMenu from './UserMenu.tsx';
import LoginModal from './LoginModal.tsx';
import RegisterModal from './RegisterModal.tsx';
import ForgotPasswordModal from './ForgotPasswordModal.tsx';

const Auth: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const handleOpenLogin = () => setIsLoginModalOpen(true);
  const handleCloseLogin = () => setIsLoginModalOpen(false);
  
  const handleOpenRegister = () => setIsRegisterModalOpen(true);
  const handleCloseRegister = () => setIsRegisterModalOpen(false);

  const handleOpenForgotPassword = () => setIsForgotPasswordModalOpen(true);
  const handleCloseForgotPassword = () => setIsForgotPasswordModalOpen(false);

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleCloseForgotPassword(); // Close forgot password modal if open
    handleOpenLogin();
  };
  
  const switchToForgotPassword = () => {
    handleCloseLogin();
    handleOpenForgotPassword();
  };


  if (currentUser) {
    return <UserMenu user={currentUser} onLogout={logout} />;
  }

  return (
    <>
      <button
        onClick={handleOpenLogin}
        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
      >
        Đăng nhập
      </button>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLogin} 
        onSwitchToRegister={switchToRegister}
        onSwitchToForgotPassword={switchToForgotPassword}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegister}
        onSwitchToLogin={switchToLogin}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={handleCloseForgotPassword}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

export default Auth;