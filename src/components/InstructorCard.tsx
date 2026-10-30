import React from 'react';
import { Star, Award, Calendar } from 'lucide-react';
import { Instructor } from '../types';

interface InstructorCardProps {
  instructor: Instructor;
  onSelect?: (id: string) => void;
  onViewSchedule?: (id: string) => void;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onSelect, onViewSchedule }) => {
  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col border border-black/8 hover:border-black/20 transition-all duration-300">
      <div className="relative h-64 w-full bg-neutral-100 overflow-hidden">
        <img
          src={instructor.imageUrl}
          alt={instructor.name}
          className="w-full h-full object-cover grayscale-[25%] hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-neutral-900 flex items-center gap-1 border border-black/5 shadow-xs">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{instructor.rating.toFixed(2)}</span>
          <span className="text-neutral-400 font-normal">({instructor.reviewsCount})</span>
        </div>

        {/* Name and Title on image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="text-[11px] tracking-wider uppercase text-neutral-300 block font-medium">
            {instructor.experienceYears} Years Practice
          </span>
          <h3 className="text-xl font-serif font-medium">{instructor.name}</h3>
          <p className="text-xs text-neutral-300 line-clamp-1">{instructor.title}</p>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
          {instructor.shortBio}
        </p>

        {/* Specialties tags */}
        <div className="flex flex-wrap gap-1.5">
          {instructor.specialties.map((spec, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800 border border-black/5">
              {spec}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-black/5 flex items-center justify-between gap-3">
          {onSelect && (
            <button
              onClick={() => onSelect(instructor.id)}
              className="text-xs font-medium text-neutral-800 hover:text-black underline underline-offset-4 cursor-pointer"
            >
              Read Biography
            </button>
          )}

          {onViewSchedule && (
            <button
              onClick={() => onViewSchedule(instructor.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
            >
              <Calendar className="w-3 h-3" />
              <span>Classes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
