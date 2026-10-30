import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const AdminAnalytics: React.FC = () => {
  const { classes, sessions } = useStudio();

  // Style popularity aggregation
  const styleStats = [
    { style: 'Vinyasa Flow', share: 38, count: 42 },
    { style: 'Yin & Sound', share: 29, count: 32 },
    { style: 'Hatha Foundation', share: 18, count: 20 },
    { style: 'Kundalini & Breath', share: 15, count: 16 },
  ];

  const occupancyByDay = [
    { day: 'Mon', rate: 76 },
    { day: 'Tue', rate: 82 },
    { day: 'Wed', rate: 68 },
    { day: 'Thu', rate: 85 },
    { day: 'Fri', rate: 79 },
    { day: 'Sat', rate: 94 },
    { day: 'Sun', rate: 91 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-medium text-white">
          Performance Analytics &amp; Trends
        </h1>
        <p className="text-xs text-neutral-400">
          Empirical attendance patterns, style distribution, and capacity metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Style Distribution */}
        <div className="bg-neutral-800/40 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="font-serif font-medium text-sm text-white">
            Booking Distribution by Yoga Modality
          </h3>

          <div className="space-y-4">
            {styleStats.map((item) => (
              <div key={item.style} className="space-y-1 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span>{item.style}</span>
                  <span className="font-mono text-white font-semibold">{item.share}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Day-by-Day Occupancy */}
        <div className="bg-neutral-800/40 border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="font-serif font-medium text-sm text-white">
            Average Mat Occupancy by Day of Week
          </h3>

          <div className="flex items-end justify-between h-48 pt-6 px-2">
            {occupancyByDay.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-[10px] font-mono text-neutral-400">{d.rate}%</span>
                <div className="w-8 rounded-t-lg bg-neutral-700 hover:bg-white transition-colors relative flex items-end" style={{ height: `${d.rate}%` }}>
                  <div className="w-full bg-white/80 rounded-t-lg" style={{ height: `${d.rate}%` }} />
                </div>
                <span className="text-xs text-neutral-400 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
