import React from 'react';
import { useStudio } from '../context/StudioContext';
import { InstructorCard } from '../components/InstructorCard';

interface InstructorsProps {
  navigate: (route: string) => void;
}

export const Instructors: React.FC<InstructorsProps> = ({ navigate }) => {
  const { instructors } = useStudio();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-neutral-800 text-xs font-medium">
          <span>Faculty Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-neutral-900">
          Our Guiding Faculty
        </h1>
        <p className="text-sm text-neutral-600 font-light max-w-2xl leading-relaxed">
          Rooted in traditional lineages and contemporary biomechanics. Each instructor at ASANA-Yoga holds advanced certifications and brings decades of combined somatic wisdom.
        </p>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {instructors.map((inst) => (
          <InstructorCard
            key={inst.id}
            instructor={inst}
            onSelect={(id) => navigate(`/instructors/${id}`)}
            onViewSchedule={() => navigate('/schedule')}
          />
        ))}
      </div>
    </div>
  );
};
