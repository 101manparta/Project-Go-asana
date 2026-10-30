import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USER, INITIAL_ADMIN_USER } from '../data/seedData';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginAsCustomer: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateUserPreferences: (prefs: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage for persisted session or default to demo customer
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('asana_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  const role: UserRole = user?.role || 'CUSTOMER';
  const isAuthenticated = !!user;
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

  useEffect(() => {
    if (user) {
      localStorage.setItem('asana_user_session', JSON.stringify(user));
      api.setAuthHeaders(user.role, user.uid);
    } else {
      localStorage.removeItem('asana_user_session');
      api.setAuthHeaders('CUSTOMER', '');
    }
  }, [user]);

  const loginAsCustomer = () => {
    setUser({ ...INITIAL_USER });
  };

  const loginAsAdmin = () => {
    setUser({ ...INITIAL_ADMIN_USER });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserPreferences = async (prefs: any) => {
    if (!user) return;
    try {
      const res = await api.updateProfile({ preferences: prefs });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to update preferences', err);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await api.getMyProfile();
      setUser(res.data);
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdmin,
        loginAsCustomer,
        loginAsAdmin,
        logout,
        updateUserPreferences,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
