import React from 'react';
import { ArrowLeft, Star, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

interface InstructorDetailProps {
  instructorId: string;
  navigate: (route: string) => void;
}

export const InstructorDetail: React.FC<InstructorDetailProps> = ({ instructorId, navigate }) => {
  const { instructors, sessions, classes, openBookingModal } = useStudio();

  const instructor = instructors.find(i => i.id === instructorId);

  if (!instructor) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-medium text-neutral-900">Instructor Not Found</h2>
        <button
          onClick={() => navigate('/instructors')}
          className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium cursor-pointer"
        >
          Back to Faculty Directory
        </button>
      </div>
    );
  }

  // Find upcoming sessions with this instructor
  const instructorSessions = sessions
    .filter(s => s.instructorId === instructor.id && s.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/instructors')}
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-950 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Faculty</span>
        </button>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Photo & Badges */}
        <div className="lg:col-span-5 rounded-3xl overflow-hidden glass-card border border-black/10">
          <div className="relative h-96 w-full bg-neutral-100">
            <img
              src={instructor.imageUrl}
              alt={instructor.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-900 flex items-center gap-1.5 shadow-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{instructor.rating.toFixed(2)}</span>
              <span className="text-neutral-400 font-normal">({instructor.reviewsCount} reviews)</span>
            </div>
          </div>
          <div className="p-6 bg-white space-y-3">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Teaching Credentials &amp; Lineage
            </span>
            <div className="space-y-2">
              {instructor.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                  <Award className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
              {instructor.experienceYears} Years Dedicated Teaching
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-medium text-neutral-900">
              {instructor.name}
            </h1>
            <p className="text-sm font-medium text-neutral-600">{instructor.title}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              Specialized Modalities
            </h3>
            <div className="flex flex-wrap gap-2">
              {instructor.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              Teaching Philosophy &amp; Background
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed font-light">
              {instructor.bio}
            </p>
          </div>
        </div>

      </div>

      {/* Upcoming Sessions with this Instructor */}
      <section className="space-y-6 pt-6 border-t border-black/10">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
            Upcoming Schedule
          </span>
          <h2 className="text-2xl font-serif font-medium text-neutral-900 mt-1">
            Book a Class with {instructor.name.split(' ')[0]}
          </h2>
        </div>

        {instructorSessions.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-xs text-neutral-500">
            No public classes scheduled this week with {instructor.name}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instructorSessions.map((session) => {
              const seatsLeft = session.capacity - session.bookedCount;
              const isFull = seatsLeft <= 0;

              return (
                <div
                  key={session.id}
                  className="glass-card rounded-2xl p-5 border border-black/8 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-neutral-900">
                        {new Date(session.startsAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isFull ? 'bg-neutral-100 text-neutral-400' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {isFull ? 'Sold Out' : `${seatsLeft} spots left`}
                      </span>
                    </div>

                    <h4 className="font-serif font-medium text-base text-neutral-900">
                      {session.classTitle}
                    </h4>

                    <p className="text-xs text-neutral-500">
                      {new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {session.room}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-900">
                      ${(session.price / 100).toFixed(2)}
                    </span>
                    <button
                      onClick={() => openBookingModal(session)}
                      disabled={isFull}
                      className="px-4 py-1.5 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 cursor-pointer"
                    >
                      {isFull ? 'Waitlist' : 'Reserve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
