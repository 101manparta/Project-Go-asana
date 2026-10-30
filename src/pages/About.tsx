import React from 'react';
import { Heart, Compass, Shield, Feather, Bell } from 'lucide-react';

interface AboutProps {
  navigate: (route: string) => void;
}

export const About: React.FC<AboutProps> = ({ navigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* Hero */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-neutral-800 text-xs font-medium">
          <span>Sanctuary Story &amp; Philosophy</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-medium text-neutral-900 leading-tight">
          A Sanctuary Built for Stillness in a Noisy World.
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
          Founded in San Francisco, ASANA-Yoga was conceived as an architectural and energetic refuge where traditional yoga lineages meet mindful contemporary design.
        </p>
      </div>

      {/* Visual Collage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl overflow-hidden glass-card border border-black/10 h-[420px] bg-neutral-100">
          <img
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80"
            alt="Studio Practice"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6 text-neutral-700 text-sm leading-relaxed font-light">
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900">
            Our Guiding Pillars
          </h2>
          <p>
            We believe yoga is not a performance or an extreme workout—it is an internal alignment of somatic awareness, respiratory intelligence, and mental stillness.
          </p>
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <Feather className="w-4 h-4 text-neutral-900 shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-semibold text-neutral-900 text-sm">Intimate Small Classes</h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  We cap all classes at 14–18 mats. Teachers provide personalized biomechanical adjustments rather than shouting over loud speakers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Compass className="w-4 h-4 text-neutral-900 shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-semibold text-neutral-900 text-sm">Lineage &amp; Contemporary Anatomy</h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Our faculty honor traditional Ashtanga, Hatha, and Pranayama practices while incorporating trauma-informed somatic pacing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-neutral-900 shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-semibold text-neutral-900 text-sm">Acoustic Sound Resonance</h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Studio B is custom-engineered with acoustic dampening for pure crystal singing bowls and restorative Yoga Nidra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Environment Section */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-black/8 space-y-4">
        <h3 className="text-2xl font-serif font-medium text-neutral-900">
          Sustainable Props &amp; Conscious Materials
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed max-w-3xl">
          Every prop in our studio—from organic buckwheat bolsters to biodegradable natural tree rubber mats and harvested Portuguese cork blocks—is sourced with environmental ahimsa (non-harming).
        </p>
        <div className="pt-4">
          <button
            onClick={() => navigate('/classes')}
            className="px-6 py-3 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 cursor-pointer"
          >
            Explore Studio Classes
          </button>
        </div>
      </div>

    </div>
  );
};
