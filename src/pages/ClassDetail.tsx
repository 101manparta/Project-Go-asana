import React from 'react';
import { ArrowLeft, Clock, Calendar, Check, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { YogaClass, YogaSession } from '../types';

interface ClassDetailProps {
  classId: string;
  navigate: (route: string) => void;
}

export const ClassDetail: React.FC<ClassDetailProps> = ({ classId, navigate }) => {
  const { classes, sessions, instructors, openBookingModal } = useStudio();

  const yogaClass = classes.find(c => c.id === classId || c.slug === classId);

  if (!yogaClass) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-medium text-neutral-900">Class Not Found</h2>
        <p className="text-xs text-neutral-500">The requested class may have been moved or unpublished.</p>
        <button
          onClick={() => navigate('/classes')}
          className="px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-medium cursor-pointer"
        >
          Back to Class Catalog
        </button>
      </div>
    );
  }

  // Get upcoming sessions for this class
  const classSessions = sessions
    .filter(s => s.classId === yogaClass.id && s.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  // Get assigned instructors
  const assignedInstructors = instructors.filter(i => yogaClass.instructorIds.includes(i.id));

  // Related classes
  const relatedClasses = classes
    .filter(c => c.id !== yogaClass.id && (c.style === yogaClass.style || c.level === yogaClass.level))
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/classes')}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-950 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Classes</span>
        </button>
      </div>

      {/* Hero Header & Media */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Card */}
        <div className="lg:col-span-5 rounded-3xl overflow-hidden glass-card border border-black/10 bg-neutral-100">
          <div className="relative h-96 w-full">
            <img
              src={yogaClass.imageUrl}
              alt={yogaClass.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md text-neutral-900 shadow-xs">
                {yogaClass.style}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-md text-white">
                {yogaClass.level}
              </span>
            </div>
            <div className="absolute bottom-4 right-4 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-sm font-semibold text-neutral-900 shadow-xs">
              ${(yogaClass.price / 100).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Right Column: Title & Key Specs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {yogaClass.durationMinutes} Minutes
              </span>
              <span>•</span>
              <span className="text-emerald-700">4-Hour Free Cancellation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-medium text-neutral-900 leading-tight">
              {yogaClass.title}
            </h1>
          </div>

          <p className="text-sm sm:text-base text-neutral-700 font-light leading-relaxed">
            {yogaClass.longDescription || yogaClass.description}
          </p>

          {/* Benefits */}
          {yogaClass.benefits && yogaClass.benefits.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                Practitioner Benefits
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {yogaClass.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to Bring */}
          {yogaClass.whatToBring && yogaClass.whatToBring.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                What to Bring
              </h4>
              <div className="flex flex-wrap gap-2 text-xs text-neutral-600">
                {yogaClass.whatToBring.map((item, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-neutral-100 text-neutral-800 text-[11px]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructors */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              Guiding Mentors
            </h4>
            <div className="flex flex-wrap gap-4">
              {assignedInstructors.map(inst => (
                <div
                  key={inst.id}
                  onClick={() => navigate(`/instructors/${inst.id}`)}
                  className="flex items-center gap-3 p-2.5 pr-4 rounded-2xl glass-card border border-black/5 hover:border-black/20 cursor-pointer transition-colors"
                >
                  <img
                    src={inst.imageUrl}
                    alt={inst.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-medium text-neutral-900">{inst.name}</h5>
                    <p className="text-[10px] text-neutral-500">{inst.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* UPCOMING SCHEDULED SESSIONS FOR THIS CLASS */}
      <section className="space-y-6 pt-6 border-t border-black/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
              Available Sessions
            </span>
            <h2 className="text-2xl font-serif font-medium text-neutral-900 mt-0.5">
              Select Date &amp; Reserve Mat
            </h2>
          </div>
          <p className="text-xs text-neutral-500">
            Sessions strictly capped at studio room capacity.
          </p>
        </div>

        {classSessions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center space-y-2">
            <p className="text-xs text-neutral-600">
              No public sessions scheduled this week for this specific class.
            </p>
            <button
              onClick={() => navigate('/schedule')}
              className="text-xs font-medium text-neutral-900 underline"
            >
              Browse full weekly calendar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classSessions.map((session) => {
              const seatsLeft = session.capacity - session.bookedCount;
              const isFull = seatsLeft <= 0;

              return (
                <div
                  key={session.id}
                  className="glass-card rounded-2xl p-5 border border-black/8 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-neutral-900">
                        {new Date(session.startsAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isFull 
                          ? 'bg-neutral-100 text-neutral-500' 
                          : seatsLeft <= 2 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {isFull ? 'Sold Out' : `${seatsLeft} spots left`}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-600 space-y-1">
                      <p>
                        {new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash;{' '}
                        {new Date(session.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        ASANA-Yoga Sanctuary &bull; {session.room}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Teacher: {session.instructorName}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900">
                      ${(session.price / 100).toFixed(2)}
                    </span>
                    <button
                      onClick={() => openBookingModal(session)}
                      disabled={isFull}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        isFull
                          ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                          : 'bg-neutral-950 text-white hover:bg-neutral-800'
                      }`}
                    >
                      {isFull ? 'Full' : 'Reserve Spot'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Cancellation Policy Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-black/5 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-semibold text-neutral-900">ASANA-Yoga Cancellation Policy</h4>
          <p className="text-neutral-600 leading-relaxed">
            Reservations can be freely cancelled or rescheduled up to 4 hours prior to the scheduled start time through your customer account. Late cancellations forfeit the class credit.
          </p>
        </div>
      </div>

    </div>
  );
};
