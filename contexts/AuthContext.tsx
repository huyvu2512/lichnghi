import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../types.ts';

// Declare google object from the GSI script
declare const google: any;

interface AuthContextType {
  currentUser: User | null;
  login: (credential: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'currentUser_google';

// Simple JWT decoder
function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (credential: string) => {
    const decodedToken = decodeJwt(credential);
    if (decodedToken) {
        const user: User = {
            name: decodedToken.name,
            email: decodedToken.email,
            picture: decodedToken.picture,
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
    }
  };

  const logout = () => {
    // Disable Google's automatic sign-in for a smoother logout experience
    if (typeof google !== 'undefined') {
        google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};