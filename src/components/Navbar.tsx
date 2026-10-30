import React, { useState } from 'react';
import { MessageSquare, Calendar, Menu, X, User, Compass, Heart, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Classes', route: '/classes' },
    { label: 'Schedule', route: '/schedule' },
    { label: 'Instructors', route: '/instructors' },
    { label: 'Pricing', route: '/pricing' },
    { label: 'About', route: '/about' },
    { label: 'FAQ', route: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-black/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo Wordmark */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border border-black/15 bg-white p-1.5 flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
            <img 
              src="/public/assets/aistudio/image_2c9304de.png" 
              alt="ASANA-Yoga Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-semibold tracking-wider text-base uppercase text-neutral-900 block font-serif">
              ASANA-Yoga
            </span>
            <span className="text-[11px] text-neutral-500 tracking-tight block">
              Move Mindfully. Live Fully.
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route || currentRoute.startsWith(link.route + '/');
            return (
              <button
                key={link.route}
                onClick={() => navigate(link.route)}
                className={`text-sm tracking-tight transition-colors cursor-pointer relative py-1 ${
                  isActive
                    ? 'text-neutral-950 font-medium'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* ASANA Wellness Guide Button */}
          <button
            onClick={() => navigate('/ai')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              currentRoute === '/ai'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white/80 border border-neutral-300 text-neutral-800 hover:bg-neutral-100 hover:border-neutral-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-neutral-700" />
            <span>ASANA Wellness Guide</span>
          </button>

          {/* User Profile or Sign In */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-black/10 hover:bg-neutral-100/60 transition-colors text-xs text-neutral-800 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-medium text-[10px]">
                  {user.displayName.charAt(0)}
                </div>
                <span className="font-medium max-w-[100px] truncate">{user.displayName.split(' ')[0]}</span>
                {user.remainingCredits !== undefined && user.remainingCredits > 0 && (
                  <span className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                    {user.remainingCredits} cr
                  </span>
                )}
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card p-2 shadow-xl border border-black/10 z-50">
                  <div className="px-3 py-2 border-b border-black/5 mb-1">
                    <p className="text-xs font-semibold text-neutral-900">{user.displayName}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/account');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-neutral-100 flex items-center gap-2 text-neutral-700 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    My Account &amp; Bookings
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/schedule');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-neutral-100 flex items-center gap-2 text-neutral-700 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Reserve Next Class
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-2 mt-1 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-medium rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Quick Reserve CTA */}
          <button
            onClick={() => navigate('/classes')}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-neutral-950 text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book a Mat</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => navigate('/ai')}
            className="p-2 rounded-full border border-black/10 bg-white"
            aria-label="ASANA Wellness Guide"
          >
            <MessageSquare className="w-4 h-4 text-neutral-800" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-950"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-black/10 px-6 pt-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(link.route);
                }}
                className={`text-left text-sm py-2 px-3 rounded-xl ${
                  currentRoute === link.route ? 'bg-neutral-900 text-white font-medium' : 'text-neutral-800 hover:bg-black/5'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/ai');
              }}
              className="text-left text-sm py-2 px-3 rounded-xl bg-neutral-100 text-neutral-900 flex items-center gap-2 font-medium"
            >
              <MessageSquare className="w-4 h-4 text-neutral-800" />
              ASANA Wellness Guide
            </button>
          </nav>

          <div className="pt-4 border-t border-black/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/account');
                  }}
                  className="w-full text-center py-2.5 rounded-full border border-black/15 text-xs font-medium text-neutral-900"
                >
                  My Account &amp; Bookings
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2 text-xs text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-full text-center py-2.5 rounded-full bg-neutral-950 text-white text-xs font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
