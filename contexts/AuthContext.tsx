import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
import type { User } from '../types.ts';

// Declare google object from the GSI script
declare const google: any;

interface AuthContextType {
  currentUser: User | null;
  accessToken: string | null;
  login: (credential: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'currentUser_google';
const ACCESS_TOKEN_KEY = 'google_access_token';

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
  const [accessToken, setAccessToken] = useState<string | null>(() => {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
  });
  
  const tokenClient = useRef<any>(null);

  const logout = useCallback(() => {
    if (accessToken && typeof google !== 'undefined' && google.accounts) {
      google.accounts.oauth2.revoke(accessToken, () => {
        console.log('Google token revoked.');
      });
    }
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setCurrentUser(null);
    setAccessToken(null);
    
    // Disable Google's automatic sign-in for a smoother logout experience
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.disableAutoSelect();
    }
  }, [accessToken]);
  
  const fetchGoogleUserInfo = useCallback(async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      
      const userInfo = await response.json();
      const user: User = {
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
    } catch (error) {
      console.error("Error fetching Google user info:", error);
      logout(); // Logout if we can't fetch user info with a token
    }
  }, [logout]);


  useEffect(() => {
    if (typeof google !== 'undefined' && google.accounts) {
      tokenClient.current = google.accounts.oauth2.initTokenClient({
        // IMPORTANT: Replace with your actual Google Client ID
        client_id: '526048810427-lb5i7n09eqi270hp3dmjbervh4v0g934.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/contacts.readonly',
        callback: (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            setAccessToken(tokenResponse.access_token);
            localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.access_token);
            fetchGoogleUserInfo(tokenResponse.access_token);
          }
        },
      });
    }
  }, [fetchGoogleUserInfo]);

  // Re-authenticate on load if token exists but user info is missing
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (token && !userJson) {
        fetchGoogleUserInfo(token);
    }
  }, [fetchGoogleUserInfo]);

  const loginWithGoogle = () => {
    if (tokenClient.current) {
      tokenClient.current.requestAccessToken();
    } else {
      console.error("Google Token Client not initialized.");
    }
  };

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
        // Clear Google-specific token if logging in via credentials
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, accessToken, login, loginWithGoogle, logout }}>
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