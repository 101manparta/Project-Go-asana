import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, MessageSquare } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { ClassCard } from '../components/ClassCard';
import { YogaStyle, DifficultyLevel } from '../types';

interface ClassesProps {
  navigate: (route: string) => void;
}

export const Classes: React.FC<ClassesProps> = ({ navigate }) => {
  const { classes, isLoading } = useStudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'duration'>('featured');

  const styles: string[] = [
    'ALL',
    'Vinyasa Flow',
    'Yin & Sound',
    'Ashtanga Primary',
    'Restorative & Nidra',
    'Hatha Foundation',
    'Kundalini & Breathwork'
  ];

  const levels: string[] = ['ALL', 'All Levels', 'Beginner', 'Intermediate'];

  const filteredClasses = useMemo(() => {
    let list = [...classes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.style.toLowerCase().includes(q)
      );
    }

    if (selectedStyle !== 'ALL') {
      list = list.filter(c => c.style === selectedStyle);
    }

    if (selectedLevel !== 'ALL') {
      list = list.filter(c => c.level === selectedLevel || c.level === 'All Levels');
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'duration') {
      list.sort((a, b) => a.durationMinutes - b.durationMinutes);
    }

    return list;
  }, [classes, searchQuery, selectedStyle, selectedLevel, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-neutral-800 text-xs font-medium">
          <span>ASANA-Yoga Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-neutral-900">
          Our Classes &amp; Practices
        </h1>
        <p className="text-sm text-neutral-600 font-light max-w-2xl leading-relaxed">
          Explore authentic movement modalities guided by master lineage mentors. Filter by level or let our ASANA Wellness Guide tailor a recommendation.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-3xl p-5 border border-black/8 space-y-4">
        
        {/* Search input + Guide helper button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search classes, styles, breathwork, or sound healing..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-xs text-neutral-900 placeholder:text-neutral-400 border border-black/10 focus:outline-none focus:border-neutral-900"
            />
          </div>

          <button
            onClick={() => navigate('/ai')}
            className="px-4 py-2.5 rounded-full bg-neutral-100 border border-black/10 text-neutral-800 text-xs font-medium hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-neutral-700" />
            <span>ASANA Wellness Guide</span>
          </button>
        </div>

        {/* Style Filters Chips */}
        <div className="space-y-2 pt-1 border-t border-black/5">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            <Filter className="w-3 h-3" />
            <span>Style:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                  selectedStyle === style
                    ? 'bg-neutral-900 text-white font-medium shadow-xs'
                    : 'bg-white border border-black/10 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {style === 'ALL' ? 'All Styles' : style}
              </button>
            ))}
          </div>
        </div>

        {/* Level & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-black/5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium">Level:</span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-full text-[11px] transition-colors cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {lvl === 'ALL' ? 'Any Level' : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-black/10 rounded-full px-3 py-1 text-xs text-neutral-800 focus:outline-none"
            >
              <option value="featured">Featured Practice</option>
              <option value="price-asc">Price (Lowest first)</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

      </div>

      {/* Class Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-neutral-200/60" />
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <p className="text-sm font-serif font-medium text-neutral-900">
            No classes match your current filters.
          </p>
          <p className="text-xs text-neutral-500">
            Try adjusting your style or level criteria, or ask our ASANA Wellness Guide for alternative sessions.
          </p>
          <button
            onClick={() => {
              setSelectedStyle('ALL');
              setSelectedLevel('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredClasses.map((c) => (
            <ClassCard
              key={c.id}
              yogaClass={c}
              onSelect={(id) => navigate(`/classes/${id}`)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
