import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudioProvider } from './context/StudioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { Toast } from './components/Toast';

// Public Pages
import { Home } from './pages/Home';
import { Classes } from './pages/Classes';
import { ClassDetail } from './pages/ClassDetail';
import { Instructors } from './pages/Instructors';
import { InstructorDetail } from './pages/InstructorDetail';
import { Schedule } from './pages/Schedule';
import { Pricing } from './pages/Pricing';
import { AIYogaAssistant } from './pages/AIYogaAssistant';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Account } from './pages/Account';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminBookings } from './admin/AdminBookings';
import { AdminClasses } from './admin/AdminClasses';
import { AdminSchedule } from './admin/AdminSchedule';
import { AdminInstructors } from './admin/AdminInstructors';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminMemberships } from './admin/AdminMemberships';
import { AdminAiCopilot } from './admin/AdminAiCopilot';
import { AdminAnalytics } from './admin/AdminAnalytics';
import { AdminSettings } from './admin/AdminSettings';

function AppContent() {
  // Simple browser history synced client-side router
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const { isAdmin, isAuthenticated } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: string) => {
    if (route !== currentRoute) {
      window.history.pushState({}, '', route);
      setCurrentRoute(route);
      window.scrollTo(0, 0);
    }
  };

  const isAdminRoute = currentRoute.startsWith('/admin');

  // ADMIN SUBTREE (Completely Separated Layout & Access Control)
  if (isAdminRoute) {
    // If not authenticated as Admin, show AdminLogin
    if (!isAdmin) {
      return (
        <>
          <AdminLogin navigate={navigate} />
          <Toast />
        </>
      );
    }

    // Authenticated Admin Dashboard
    return (
      <AdminLayout currentRoute={currentRoute} navigate={navigate}>
        {currentRoute === '/admin' || currentRoute === '/admin/dashboard' ? (
          <AdminDashboard navigate={navigate} />
        ) : currentRoute === '/admin/bookings' ? (
          <AdminBookings />
        ) : currentRoute === '/admin/classes' ? (
          <AdminClasses />
        ) : currentRoute === '/admin/schedule' ? (
          <AdminSchedule />
        ) : currentRoute === '/admin/instructors' ? (
          <AdminInstructors />
        ) : currentRoute === '/admin/customers' ? (
          <AdminCustomers />
        ) : currentRoute === '/admin/memberships' ? (
          <AdminMemberships />
        ) : currentRoute === '/admin/copilot' || currentRoute === '/admin/ai' ? (
          <AdminAiCopilot />
        ) : currentRoute === '/admin/analytics' ? (
          <AdminAnalytics />
        ) : currentRoute === '/admin/settings' ? (
          <AdminSettings />
        ) : (
          <AdminDashboard navigate={navigate} />
        )}
        <Toast />
      </AdminLayout>
    );
  }

  // PUBLIC WEBSITE SUBTREE (Zero Admin Controls visible)
  const renderPublicPage = () => {
    if (currentRoute === '/') {
      return <Home navigate={navigate} />;
    }
    if (currentRoute === '/classes') {
      return <Classes navigate={navigate} />;
    }
    if (currentRoute.startsWith('/classes/')) {
      const classId = currentRoute.replace('/classes/', '');
      return <ClassDetail classId={classId} navigate={navigate} />;
    }
    if (currentRoute === '/instructors') {
      return <Instructors navigate={navigate} />;
    }
    if (currentRoute.startsWith('/instructors/')) {
      const instructorId = currentRoute.replace('/instructors/', '');
      return <InstructorDetail instructorId={instructorId} navigate={navigate} />;
    }
    if (currentRoute === '/schedule') {
      return <Schedule navigate={navigate} />;
    }
    if (currentRoute === '/pricing') {
      return <Pricing navigate={navigate} />;
    }
    if (currentRoute === '/ai') {
      return <AIYogaAssistant navigate={navigate} />;
    }
    if (currentRoute === '/about') {
      return <About navigate={navigate} />;
    }
    if (currentRoute === '/contact') {
      return <Contact />;
    }
    if (currentRoute === '/faq') {
      return <FAQ navigate={navigate} />;
    }
    if (currentRoute === '/account' || currentRoute === '/login' || currentRoute === '/register') {
      return <Account navigate={navigate} />;
    }

    return <Home navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Navbar currentRoute={currentRoute} navigate={navigate} />
      
      <main className="flex-1">
        {renderPublicPage()}
      </main>

      <Footer navigate={navigate} />
      <BookingModal navigate={navigate} />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StudioProvider>
        <AppContent />
      </StudioProvider>
    </AuthProvider>
  );
}
