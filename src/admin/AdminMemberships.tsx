import React from 'react';
import { CreditCard, Check, Plus } from 'lucide-react';
import { INITIAL_MEMBERSHIPS } from '../data/seedData';

export const AdminMemberships: React.FC = () => {
  const plans = INITIAL_MEMBERSHIPS;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-white">
            Membership Packages &amp; Passes
          </h1>
          <p className="text-xs text-neutral-400">
            Configure credit bundles, pricing tiers, and terms of service.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="bg-neutral-800/50 border border-white/10 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase text-emerald-400">Active Tier</span>
                <span className="text-xs font-semibold text-white">${(p.price / 100).toFixed(0)}</span>
              </div>

              <h4 className="font-serif font-semibold text-white text-base">{p.name}</h4>
              <p className="text-xs text-neutral-400">{p.description}</p>

              <div className="pt-2 text-xs text-neutral-300 space-y-1">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px]">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 text-[11px] text-neutral-500">
              Credits: {p.classCredits === 0 ? 'Unlimited' : `${p.classCredits} credits`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
