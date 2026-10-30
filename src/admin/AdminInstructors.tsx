import React from 'react';
import { Star, Award, CheckCircle2, User } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const AdminInstructors: React.FC = () => {
  const { instructors } = useStudio();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-medium text-white">
          Instructors &amp; Faculty
        </h1>
        <p className="text-xs text-neutral-400">
          Directory of registered lineage teachers, ratings, and teaching status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructors.map((inst) => (
          <div
            key={inst.id}
            className="bg-neutral-800/50 border border-white/10 rounded-2xl overflow-hidden p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={inst.imageUrl}
                alt={inst.name}
                className="w-12 h-12 rounded-full object-cover border border-white/20"
              />
              <div>
                <h4 className="font-semibold text-white text-sm">{inst.name}</h4>
                <p className="text-[11px] text-neutral-400">{inst.title}</p>
              </div>
            </div>

            <div className="text-xs text-neutral-400 space-y-1">
              <div className="flex justify-between">
                <span>Rating</span>
                <span className="text-amber-400 font-semibold">{inst.rating.toFixed(2)} ({inst.reviewsCount})</span>
              </div>
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="text-white">{inst.experienceYears} Years</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="text-emerald-400">Active Faculty</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1">
              {inst.specialties.map((spec, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
