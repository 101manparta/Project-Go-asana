import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  CreditCard, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  LogOut,
  Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';
import { Booking } from '../types';

interface AccountProps {
  navigate: (route: string) => void;
}

export const Account: React.FC<AccountProps> = ({ navigate }) => {
  const { user, isAuthenticated, loginAsCustomer, logout, refreshProfile } = useAuth();
  const { showToast, refreshData } = useStudio();

  const [activeTab, setActiveTab] = useState<'bookings' | 'membership' | 'profile'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // Profile edit fields
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoadingBookings(true);
      const res = await api.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    if (user) {
      setDisplayName(user.displayName);
      setPhone(user.phone || '');
    }
  }, [isAuthenticated, user]);

  const handleCancelBooking = async (booking: Booking) => {
    if (!confirm(`Are you sure you want to cancel your reservation for ${booking.classTitle}?`)) {
      return;
    }

    setCancellingBookingId(booking.id);
    try {
      await api.cancelBooking(booking.id);
      showToast('Booking cancelled. Capacity released and credit returned.', 'success');
      await Promise.all([fetchBookings(), refreshProfile(), refreshData()]);
    } catch (err: any) {
      console.error('Cancel booking error:', err);
      showToast(err.message || 'Unable to cancel booking.', 'error');
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await api.updateProfile({ displayName, phone });
      await refreshProfile();
      showToast('Profile updated successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-medium text-neutral-900">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-neutral-500">
            Access your reserved yoga classes, membership credits, and personalized practice history.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-black/8 space-y-3">
          <button
            onClick={() => loginAsCustomer()}
            className="w-full py-3 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 cursor-pointer shadow-xs"
          >
            Demo Sign In as Arya Sen (Customer)
          </button>
          <p className="text-[11px] text-neutral-400">
            Preview the full booking history, 5-pack credits, and cancellation workflows.
          </p>
        </div>
      </div>
    );
  }

  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const pastOrCancelled = bookings.filter(b => b.status !== 'CONFIRMED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Account Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-black/8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-medium font-serif">
            {user.displayName.charAt(0)}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-medium text-neutral-900">
              {user.displayName}
            </h1>
            <p className="text-xs text-neutral-500">{user.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-black/5">
                {user.membershipName || 'Drop-In Customer'}
              </span>
              {user.remainingCredits !== undefined && (
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {user.remainingCredits} credits available
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/schedule')}
            className="px-4 py-2 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 cursor-pointer shadow-xs"
          >
            Book Next Class
          </button>
          <button
            onClick={() => logout()}
            className="p-2 rounded-full border border-black/10 text-neutral-600 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-black/10 gap-8 text-xs font-medium">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 relative cursor-pointer ${
            activeTab === 'bookings' ? 'text-neutral-950 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>My Reservations ({activeBookings.length})</span>
          {activeTab === 'bookings' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('membership')}
          className={`pb-3 relative cursor-pointer ${
            activeTab === 'membership' ? 'text-neutral-950 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Passes &amp; Credits</span>
          {activeTab === 'membership' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 relative cursor-pointer ${
            activeTab === 'profile' ? 'text-neutral-950 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <span>Profile &amp; Preferences</span>
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
          )}
        </button>
      </div>

      {/* TAB 1: RESERVATIONS */}
      {activeTab === 'bookings' && (
        <div className="space-y-8">
          {/* Active Bookings */}
          <div className="space-y-4">
            <h3 className="font-serif font-medium text-lg text-neutral-900">
              Upcoming Reserved Sessions
            </h3>

            {isLoadingBookings ? (
              <div className="p-8 text-center text-xs text-neutral-400">Loading reservations...</div>
            ) : activeBookings.length === 0 ? (
              <div className="glass-panel rounded-3xl p-8 text-center space-y-3">
                <Calendar className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="text-sm font-serif font-medium text-neutral-900">No active reservations</h4>
                <p className="text-xs text-neutral-500">
                  Ready to return to the mat? Browse our weekly calendar for open spots.
                </p>
                <button
                  onClick={() => navigate('/schedule')}
                  className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium cursor-pointer"
                >
                  View Schedule
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBookings.map((b) => (
                  <div
                    key={b.id}
                    className="glass-card rounded-2xl p-5 border border-black/8 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-semibold text-neutral-900">
                          Ref: {b.bookingReference}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {b.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-serif font-semibold text-base text-neutral-900">
                          {b.classTitle}
                        </h4>
                        <p className="text-xs text-neutral-500">Guided by {b.instructorName}</p>
                      </div>

                      <div className="space-y-1 text-xs text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-black/5">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>
                            {new Date(b.sessionStartsAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                            {new Date(b.sessionStartsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>ASANA-Yoga Sanctuary &bull; Lotus Room</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">
                        Free cancel 4h prior
                      </span>
                      <button
                        onClick={() => handleCancelBooking(b)}
                        disabled={cancellingBookingId === b.id}
                        className="px-3.5 py-1.5 rounded-full border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingBookingId === b.id ? 'Cancelling...' : 'Cancel Reservation'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past / Cancelled History */}
          {pastOrCancelled.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-black/10">
              <h3 className="font-serif font-medium text-base text-neutral-700">
                Past &amp; Cancelled Sessions
              </h3>
              <div className="space-y-2">
                {pastOrCancelled.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-white border border-black/5 flex items-center justify-between text-xs text-neutral-600"
                  >
                    <div>
                      <span className="font-semibold text-neutral-800">{b.classTitle}</span>
                      <span className="text-neutral-400 block text-[11px]">
                        Ref: {b.bookingReference} &bull; {new Date(b.sessionStartsAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEMBERSHIP & PASSES */}
      {activeTab === 'membership' && (
        <div className="space-y-6 max-w-2xl">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-black/8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase font-semibold text-neutral-400 tracking-wider">
                  Active Package
                </span>
                <h3 className="text-xl font-serif font-medium text-neutral-900 mt-1">
                  {user.membershipName || 'Standard Drop-In Customer'}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-black/5 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-500 block">Remaining Class Credits</span>
                <span className="text-2xl font-serif font-semibold text-neutral-900">
                  {user.remainingCredits ?? 0}
                </span>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="px-4 py-2 rounded-full bg-neutral-950 text-white text-xs font-medium cursor-pointer"
              >
                Top-Up Credits
              </button>
            </div>

            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Credits can be applied toward any 60-min or 75-min regular studio class and sound bath. Cancellations made 4+ hours before class automatically replenish your credit balance.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE & PREFERENCES */}
      {activeTab === 'profile' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-black/8 max-w-xl">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <h3 className="font-serif font-medium text-lg text-neutral-900 mb-2">
              Edit Account Profile
            </h3>

            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 rounded-xl border border-black/5 bg-neutral-100 text-neutral-500 text-xs cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-neutral-700">Contact Telephone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
