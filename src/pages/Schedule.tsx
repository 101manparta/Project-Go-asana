import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Filter, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { YogaSession } from '../types';

interface ScheduleProps {
  navigate: (route: string) => void;
}

export const Schedule: React.FC<ScheduleProps> = ({ navigate }) => {
  const { sessions, classes, instructors, openBookingModal } = useStudio();
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [filterStyle, setFilterStyle] = useState<string>('ALL');

  // Days list (Today, Tomorrow, +2 days, +3 days)
  const baseDate = new Date('2026-10-29T00:00:00Z');
  const days = [0, 1, 2, 3].map((offset) => {
    const d = new Date(baseDate);
    d.setUTCDate(d.getUTCDate() + offset);
    return {
      offset,
      dateString: d.toISOString().split('T')[0],
      dayName: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateFormatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const activeDay = days.find(d => d.offset === selectedDayOffset) || days[0];

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchDate = s.startsAt.startsWith(activeDay.dateString);
      if (!matchDate) return false;

      if (filterStyle !== 'ALL') {
        const cls = classes.find(c => c.id === s.classId);
        if (!cls || cls.style !== filterStyle) return false;
      }
      return true;
    }).sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [sessions, activeDay, filterStyle, classes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-neutral-800 text-xs font-medium">
            <span>Studio Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-medium text-neutral-900">
            Weekly Schedule
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-light max-w-xl">
            Live schedule synced with studio capacity. All sessions displayed in Pacific Standard Time (PST).
          </p>
        </div>

        <button
          onClick={() => navigate('/ai')}
          className="px-4 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium transition-colors inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask ASANA Wellness Guide</span>
        </button>
      </div>

      {/* Date Selector Tabs */}
      <div className="glass-panel rounded-3xl p-3 border border-black/8 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {days.map((day) => (
            <button
              key={day.offset}
              onClick={() => setSelectedDayOffset(day.offset)}
              className={`px-5 py-3 rounded-2xl text-xs transition-all flex flex-col items-center min-w-[100px] cursor-pointer ${
                selectedDayOffset === day.offset
                  ? 'bg-neutral-900 text-white font-medium shadow-md'
                  : 'bg-white/80 border border-black/5 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span className="font-semibold text-xs">{day.dayName}</span>
              <span className={`text-[10px] ${selectedDayOffset === day.offset ? 'text-neutral-300' : 'text-neutral-400'}`}>
                {day.dateFormatted}
              </span>
            </button>
          ))}
        </div>

        {/* Style Filter Dropdown */}
        <div className="hidden sm:flex items-center gap-2 pr-3">
          <span className="text-xs text-neutral-500">Style:</span>
          <select
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
            className="bg-white border border-black/10 rounded-full px-3 py-1.5 text-xs text-neutral-800 focus:outline-none"
          >
            <option value="ALL">All Practice Styles</option>
            <option value="Vinyasa Flow">Vinyasa Flow</option>
            <option value="Yin & Sound">Yin &amp; Sound</option>
            <option value="Hatha Foundation">Hatha Foundations</option>
            <option value="Kundalini & Breathwork">Kundalini &amp; Breath</option>
            <option value="Restorative & Nidra">Restorative &amp; Nidra</option>
            <option value="Ashtanga Primary">Ashtanga Primary</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
            <CalendarIcon className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="text-base font-serif font-medium text-neutral-900">
              No sessions found for this day with current filter.
            </h3>
            <p className="text-xs text-neutral-500">
              Try switching to another day or choosing &ldquo;All Practice Styles&rdquo;.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const seatsLeft = session.capacity - session.bookedCount;
            const isFull = seatsLeft <= 0;
            const relatedClass = classes.find(c => c.id === session.classId);

            return (
              <div
                key={session.id}
                className="glass-card rounded-2xl p-5 sm:p-6 border border-black/8 hover:border-black/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Time & Room */}
                <div className="flex items-center gap-6 sm:w-1/4">
                  <div>
                    <div className="text-base sm:text-lg font-serif font-semibold text-neutral-900">
                      {new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {relatedClass?.durationMinutes || 60} mins
                    </div>
                  </div>
                  <div className="border-l border-black/10 pl-4">
                    <span className="text-[11px] text-neutral-500 block">{session.room}</span>
                    <span className="text-[10px] text-neutral-400">Studio A/B</span>
                  </div>
                </div>

                {/* Class Title & Guide */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      onClick={() => relatedClass && navigate(`/classes/${relatedClass.id}`)}
                      className="font-serif font-medium text-base sm:text-lg text-neutral-900 hover:underline cursor-pointer"
                    >
                      {session.classTitle}
                    </h3>
                    {relatedClass && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                        {relatedClass.style}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <span>Guided by {session.instructorName}</span>
                    <span>&bull;</span>
                    <span className="text-neutral-500">{relatedClass?.level || 'All Levels'}</span>
                  </div>
                </div>

                {/* Capacity & Reserve Button */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-black/5">
                  <div className="text-right">
                    <span className="text-sm font-semibold text-neutral-900 block">
                      ${(session.price / 100).toFixed(2)}
                    </span>
                    <span className={`text-[10px] font-semibold ${
                      isFull 
                        ? 'text-neutral-400' 
                        : seatsLeft <= 2 
                        ? 'text-amber-600' 
                        : 'text-emerald-700'
                    }`}>
                      {isFull ? 'Sold Out' : `${seatsLeft} spots left`}
                    </span>
                  </div>

                  <button
                    onClick={() => openBookingModal(session)}
                    disabled={isFull}
                    className={`px-5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all shadow-xs ${
                      isFull
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-neutral-950 text-white hover:bg-neutral-800'
                    }`}
                  >
                    {isFull ? 'Waitlist' : 'Book Mat'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
