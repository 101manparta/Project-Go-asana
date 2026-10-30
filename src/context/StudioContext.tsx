import React, { createContext, useContext, useState, useEffect } from 'react';
import { YogaClass, YogaSession, Instructor, StudioSettings } from '../types';
import { api } from '../services/api';

interface StudioContextType {
  classes: YogaClass[];
  sessions: YogaSession[];
  instructors: Instructor[];
  settings: StudioSettings | null;
  isLoading: boolean;
  selectedSessionForBooking: YogaSession | null;
  openBookingModal: (session: YogaSession) => void;
  closeBookingModal: () => void;
  refreshData: () => Promise<void>;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [sessions, setSessions] = useState<YogaSession[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSessionForBooking, setSelectedSessionForBooking] = useState<YogaSession | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [classRes, sessRes, instRes, settRes] = await Promise.all([
        api.getClasses(),
        api.getSessions(),
        api.getInstructors(),
        api.getAdminSettings().catch(() => ({ data: null })),
      ]);

      setClasses(classRes.data);
      setSessions(sessRes.data);
      setInstructors(instRes.data);
      if (settRes?.data) setSettings(settRes.data);
    } catch (err) {
      console.error('Failed to load initial studio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openBookingModal = (session: YogaSession) => {
    setSelectedSessionForBooking(session);
  };

  const closeBookingModal = () => {
    setSelectedSessionForBooking(null);
  };

  return (
    <StudioContext.Provider
      value={{
        classes,
        sessions,
        instructors,
        settings,
        isLoading,
        selectedSessionForBooking,
        openBookingModal,
        closeBookingModal,
        refreshData: loadData,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioProvider');
  return ctx;
};
