import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking } from '../types';

interface BookingModalProps {
  navigate: (route: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ navigate }) => {
  const { selectedSessionForBooking, closeBookingModal, refreshData, showToast } = useStudio();
  const { user, isAuthenticated, loginAsCustomer, refreshProfile } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!selectedSessionForBooking) return null;

  const session = selectedSessionForBooking;
  const seatsLeft = session.capacity - session.bookedCount;
  const isSoldOut = seatsLeft <= 0;

  const formatSessionTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatSessionDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      setError('Please sign in or continue as guest to reserve your spot.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const idempotencyKey = `idemp-${session.id}-${user?.uid}-${Date.now()}`;

    try {
      const response = await api.createBooking(session.id, idempotencyKey);
      setConfirmedBooking(response.data);
      await Promise.all([refreshData(), refreshProfile()]);
      showToast(`Reserved! Reference: ${response.data.bookingReference}`, 'success');
    } catch (err: any) {
      console.error('Booking failed:', err);
      setError(err.message || 'Unable to confirm booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    setError(null);
    closeBookingModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-black/10 relative overflow-hidden text-neutral-900"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation Success View */
          <div className="py-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-semibold text-emerald-700 tracking-wider">
                Reservation Confirmed
              </span>
              <h3 className="text-2xl font-serif font-medium text-neutral-900 mt-1">
                Your Mat is Reserved
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                A confirmation has been saved to your account.
              </p>
            </div>

            {/* Booking Details Ticket */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-black/5 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-black/5">
                <span className="text-neutral-500 font-medium">Booking Reference</span>
                <span className="font-mono font-semibold text-neutral-900 text-sm">
                  {confirmedBooking.bookingReference}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Class</span>
                <span className="font-medium text-neutral-900">{confirmedBooking.classTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Instructor</span>
                <span className="font-medium text-neutral-900">{confirmedBooking.instructorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Date &amp; Time</span>
                <span className="font-medium text-neutral-900">
                  {formatSessionDate(confirmedBooking.sessionStartsAt)} at {formatSessionTime(confirmedBooking.sessionStartsAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Location</span>
                <span className="font-medium text-neutral-900">ASANA-Yoga Sanctuary (Room: {session.room})</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-black/5">
                <span className="text-neutral-500">Cancellation Policy</span>
                <span className="text-emerald-700 font-medium">Free cancel up to 4 hrs prior</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  navigate('/account');
                }}
                className="flex-1 py-3 px-4 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View My Bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClose}
                className="py-3 px-5 rounded-full border border-black/10 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Booking Details & Confirmation Step */
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Confirm Reservation
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-neutral-900 mt-0.5">
                {session.classTitle}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Guided by {session.instructorName}
              </p>
            </div>

            {/* Session Card Info */}
            <div className="glass-panel rounded-2xl p-4 space-y-3 text-xs border border-black/5">
              <div className="flex items-center gap-3 text-neutral-700">
                <Calendar className="w-4 h-4 text-neutral-900 shrink-0" />
                <span className="font-medium">{formatSessionDate(session.startsAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-700">
                <Clock className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>{formatSessionTime(session.startsAt)} – {formatSessionTime(session.endsAt)} (PST)</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-700">
                <MapPin className="w-4 h-4 text-neutral-900 shrink-0" />
                <span>ASANA-Yoga Sanctuary • {session.room}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-black/5 text-neutral-500">
                <span>Seat Capacity:</span>
                <span className={`font-medium ${seatsLeft <= 2 ? 'text-amber-600 font-semibold' : 'text-neutral-900'}`}>
                  {isSoldOut ? 'Waitlist Only (Sold Out)' : `${seatsLeft} of ${session.capacity} spots remaining`}
                </span>
              </div>
            </div>

            {/* Auth / Account check */}
            {!isAuthenticated ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs space-y-2">
                <p className="text-amber-900 font-medium">You are reserving as a visitor.</p>
                <p className="text-amber-800 text-[11px]">
                  Sign in to use your membership credits or auto-save this booking to your account profile.
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => loginAsCustomer()}
                    className="px-3 py-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-medium cursor-pointer"
                  >
                    Quick Sign In (Arya)
                  </button>
                  <button
                    onClick={() => {
                      handleClose();
                      navigate('/login');
                    }}
                    className="px-3 py-1.5 rounded-full border border-neutral-300 text-[11px] font-medium text-neutral-800 bg-white cursor-pointer"
                  >
                    Log In with Email
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-2xl p-3.5 border border-black/5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-medium">
                    {user?.displayName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{user?.displayName}</p>
                    <p className="text-[11px] text-neutral-500">
                      {user?.membershipName || 'Drop-In Customer'}
                    </p>
                  </div>
                </div>
                {user?.remainingCredits !== undefined && user.remainingCredits > 0 ? (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                    1 credit will be applied ({user.remainingCredits} left)
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-neutral-900">
                    ${(session.price / 100).toFixed(2)}
                  </span>
                )}
              </div>
            )}

            {/* Cancellation Notice */}
            <div className="flex items-start gap-2 text-[11px] text-neutral-500 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
              <span>
                <strong>Studio Policy:</strong> Full cancellation refund up to 4 hours prior to class start. Late cancellations or no-shows forfeit credits.
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-5 rounded-full border border-black/10 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || isSoldOut}
                onClick={handleConfirmBooking}
                className={`flex-1 py-3 px-5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isSoldOut
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-950 text-white hover:bg-neutral-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reserving Spot...</span>
                  </>
                ) : isSoldOut ? (
                  <span>Fully Booked</span>
                ) : (
                  <span>Confirm Reservation</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
