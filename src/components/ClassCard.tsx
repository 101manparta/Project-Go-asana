import React from 'react';
import { Clock, Users, ArrowUpRight } from 'lucide-react';
import { YogaClass } from '../types';
import { useStudio } from '../context/StudioContext';

interface ClassCardProps {
  yogaClass: YogaClass;
  onSelect: (id: string) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ yogaClass, onSelect }) => {
  const { sessions, openBookingModal } = useStudio();

  // Find next available upcoming session for this class
  const nextSession = sessions
    .filter(s => s.classId === yogaClass.id && s.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0];

  const seatsLeft = nextSession ? nextSession.capacity - nextSession.bookedCount : 0;

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col group border border-black/8 hover:border-black/20 transition-all duration-300">
      {/* Visual Image container */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
        <img
          src={yogaClass.imageUrl}
          alt={yogaClass.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Badges on image */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-neutral-900 border border-black/5 shadow-xs">
            {yogaClass.style}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/40 backdrop-blur-md text-white border border-white/20">
            {yogaClass.level}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-neutral-900 border border-black/5 shadow-xs">
          ${(yogaClass.price / 100).toFixed(2)}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-3 text-xs text-neutral-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              {yogaClass.durationMinutes} min
            </span>
            <span>•</span>
            <span>Free cancellation (4h)</span>
          </div>

          <h3 className="text-lg font-serif font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors">
            {yogaClass.title}
          </h3>
          <p className="text-xs text-neutral-600 line-clamp-2 mt-1.5 leading-relaxed">
            {yogaClass.description}
          </p>
        </div>

        {/* Benefits Chips */}
        {yogaClass.benefits && yogaClass.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {yogaClass.benefits.slice(0, 3).map((benefit, i) => (
              <span key={i} className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                {benefit}
              </span>
            ))}
          </div>
        )}

        {/* Next Session & Action Buttons */}
        <div className="pt-3 border-t border-black/5 flex items-center justify-between gap-3">
          {nextSession ? (
            <div className="text-[11px]">
              <span className="text-neutral-400 block text-[10px]">Next Session</span>
              <span className="font-medium text-neutral-800">
                {new Date(nextSession.startsAt).toLocaleDateString([], { weekday: 'short' })} at{' '}
                {new Date(nextSession.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`block text-[10px] ${seatsLeft <= 2 ? 'text-amber-600 font-semibold' : 'text-neutral-500'}`}>
                {seatsLeft > 0 ? `${seatsLeft} spots left` : 'Waitlist only'}
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-neutral-400">
              Check weekly schedule
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(yogaClass.id)}
              className="p-2 rounded-full border border-black/10 hover:bg-neutral-100 transition-colors text-neutral-700 cursor-pointer"
              title="View class details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
            {nextSession && (
              <button
                onClick={() => openBookingModal(nextSession)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-neutral-950 text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
              >
                Reserve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
