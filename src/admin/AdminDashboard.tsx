import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  Bot,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { YogaSession } from '../types';

interface AdminDashboardProps {
  navigate: (route: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAdminDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-neutral-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-neutral-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics, lowEnrollmentSessions, upcomingSessions, recentAuditLogs } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
            ASANA-Yoga Operations &bull; Live Telemetry
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-white mt-1">
            ASANA-Yoga Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/copilot')}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-neutral-300" />
            <span>Studio Copilot</span>
          </button>
          <button
            onClick={() => navigate('/admin/schedule')}
            className="px-4 py-2 rounded-xl bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            + Schedule Session
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Occupancy */}
        <div className="bg-neutral-800/60 border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Seat Occupancy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-serif font-medium text-white">
            {metrics.sessionOccupancyRate}%
          </div>
          <p className="text-[11px] text-neutral-400">
            Across {metrics.totalClasses} published modalities
          </p>
        </div>

        {/* Active Reservations */}
        <div className="bg-neutral-800/60 border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Confirmed Bookings</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-serif font-medium text-white">
            {metrics.todayBookingsCount}
          </div>
          <p className="text-[11px] text-neutral-400">
            Cancellation rate: {metrics.cancellationRate}% (Healthy &lt;10%)
          </p>
        </div>

        {/* Active Practitioners */}
        <div className="bg-neutral-800/60 border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Registered Yogis</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-serif font-medium text-white">
            {metrics.activeMembersCount}
          </div>
          <p className="text-[11px] text-neutral-400">
            {metrics.totalInstructors} Verified Instructors
          </p>
        </div>

        {/* Monthly Revenue Snapshot */}
        <div className="bg-neutral-800/60 border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Confirmed Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-serif font-medium text-white">
            ${(metrics.monthlyRevenueCents / 100).toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-400">
            Grounded in actual booking ledger
          </p>
        </div>

      </div>

      {/* Low Enrollment Attention Alert */}
      {lowEnrollmentSessions && lowEnrollmentSessions.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-medium text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Operational Attention: {lowEnrollmentSessions.length} session(s) under 35% capacity</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowEnrollmentSessions.map((s: YogaSession) => (
              <div key={s.id} className="bg-black/30 rounded-xl p-3 border border-amber-500/20 text-xs space-y-1">
                <span className="font-semibold text-white block truncate">{s.classTitle}</span>
                <span className="text-[11px] text-neutral-400">
                  {new Date(s.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {s.instructorName}
                </span>
                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="text-amber-400 font-mono">{s.bookedCount} / {s.capacity} spots filled</span>
                  <button 
                    onClick={() => navigate('/admin/copilot')}
                    className="text-white hover:underline text-[10px]"
                  >
                    Ask Copilot &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Section: Upcoming Sessions & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upcoming Sessions */}
        <div className="lg:col-span-7 bg-neutral-800/40 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-serif font-medium text-sm text-white">
              Scheduled Studio Sessions
            </h3>
            <button
              onClick={() => navigate('/admin/schedule')}
              className="text-xs text-neutral-400 hover:text-white"
            >
              View Full Calendar &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingSessions.map((s: YogaSession) => {
              const capacityPercent = Math.round((s.bookedCount / s.capacity) * 100);

              return (
                <div
                  key={s.id}
                  className="bg-neutral-800/70 p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-white">{s.classTitle}</h4>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(s.startsAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                      {new Date(s.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {s.instructorName}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-white block">
                      {s.bookedCount} / {s.capacity} mats
                    </span>
                    <span className="text-[10px] text-neutral-400">{capacityPercent}% full</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-5 bg-neutral-800/40 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-serif font-medium text-sm text-white">
              Immutable Audit Events
            </h3>
            <span className="text-[10px] font-mono text-neutral-500">Live Ledger</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {recentAuditLogs.map((log: any) => (
              <div key={log.id} className="p-3 bg-neutral-800/70 rounded-xl border border-white/5 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-emerald-400 font-semibold">{log.action}</span>
                  <span className="text-neutral-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300">Actor: {log.actor}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
