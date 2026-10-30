import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Booking } from '../types';

export const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminBookings({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateAdminBookingStatus(id, newStatus);
      await fetchBookings();
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-white">
            Reservations Ledger
          </h1>
          <p className="text-xs text-neutral-400">
            View, filter, and moderate customer mat bookings across all studio sessions.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="p-2.5 rounded-xl bg-neutral-800 border border-white/10 hover:bg-neutral-700 text-neutral-300 transition-colors self-start sm:self-auto cursor-pointer"
          title="Refresh bookings"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-neutral-800/60 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer, class, or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBookings()}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white focus:outline-none focus:border-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="text-neutral-400">Status:</span>
          {['ALL', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-neutral-950 font-semibold'
                  : 'bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Bookings Table */}
      <div className="bg-neutral-800/40 border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-neutral-400">Loading bookings ledger...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500">
            No bookings match the specified criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-900/80 border-b border-white/10 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Class &amp; Guide</th>
                  <th className="py-3.5 px-4">Session Date &amp; Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-white">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-white block">{b.customerName}</span>
                      <span className="text-[11px] text-neutral-400">{b.customerEmail}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white block font-medium">{b.classTitle}</span>
                      <span className="text-[11px] text-neutral-400">{b.instructorName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-neutral-300">
                      {new Date(b.sessionStartsAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                      {new Date(b.sessionStartsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : b.status === 'CANCELLED'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-neutral-700 text-neutral-300'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'CONFIRMED' ? (
                        <button
                          onClick={() => handleStatusChange(b.id, 'CANCELLED')}
                          className="px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-[11px] transition-colors cursor-pointer"
                        >
                          Cancel &amp; Release
                        </button>
                      ) : b.status === 'CANCELLED' ? (
                        <button
                          onClick={() => handleStatusChange(b.id, 'CONFIRMED')}
                          className="px-2.5 py-1 rounded-lg border border-white/20 text-neutral-300 hover:bg-white/10 text-[11px] transition-colors cursor-pointer"
                        >
                          Reinstate
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
