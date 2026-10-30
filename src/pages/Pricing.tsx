import React, { useState } from 'react';
import { Check, ShieldCheck, HelpCircle, ArrowRight, Info } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { useAuth } from '../context/AuthContext';
import { INITIAL_MEMBERSHIPS } from '../data/seedData';

interface PricingProps {
  navigate: (route: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ navigate }) => {
  const { showToast } = useStudio();
  const { user, isAuthenticated } = useAuth();
  const [selectedPlanForInquiry, setSelectedPlanForInquiry] = useState<any | null>(null);

  const plans = INITIAL_MEMBERSHIPS;

  const handleSelectPlan = (plan: any) => {
    setSelectedPlanForInquiry(plan);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-neutral-800 text-xs font-medium">
          <span>Investment &amp; Tiers</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-neutral-900">
          Memberships &amp; Class Passes
        </h1>
        <p className="text-sm text-neutral-600 font-light leading-relaxed">
          Transparent pricing with zero hidden fees or locked contracts. Choose a single drop-in or commit to a monthly sanctuary rhythm.
        </p>
      </div>

      {/* Gateway Notice Box */}
      <div className="glass-panel rounded-2xl p-4 border border-amber-500/20 bg-amber-500/5 max-w-3xl mx-auto flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 text-amber-900">
          <p className="font-semibold">Payment Integration Status</p>
          <p className="text-amber-800/90 leading-relaxed">
            Stripe/Merchant Gateway is operating in development sandbox mode. You may reserve individual drop-in classes immediately, or activate class packs upon arrival at our front desk reception.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
        {plans.map((plan) => {
          const isUnlimited = plan.isUnlimited;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                isPopular
                  ? 'glass-panel-dark text-white shadow-2xl border-2 border-white/20 -translate-y-2'
                  : 'glass-card border border-black/8 text-neutral-900'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-neutral-900 text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Most Preferred
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className={`font-serif font-medium text-lg ${isPopular ? 'text-white' : 'text-neutral-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isPopular ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-serif font-medium">
                      ${(plan.price / 100).toFixed(0)}
                    </span>
                    <span className={`text-xs ${isPopular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {plan.billingPeriod === 'MONTHLY' ? '/ month' : plan.billingPeriod === 'SINGLE' ? '/ class' : ' total'}
                    </span>
                  </div>
                </div>

                <div className={`pt-4 border-t ${isPopular ? 'border-white/10' : 'border-black/5'} space-y-2.5`}>
                  <p className={`text-[11px] font-semibold uppercase tracking-wider ${isPopular ? 'text-neutral-400' : 'text-neutral-400'}`}>
                    What is included:
                  </p>
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isPopular ? 'text-amber-400' : 'text-emerald-600'}`} />
                        <span className={isPopular ? 'text-neutral-200' : 'text-neutral-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 space-y-3">
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-full text-xs font-medium cursor-pointer transition-colors shadow-xs ${
                    isPopular
                      ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                      : 'bg-neutral-950 text-white hover:bg-neutral-800'
                  }`}
                >
                  {plan.billingPeriod === 'SINGLE' ? 'Book Single Mat' : 'Select Plan'}
                </button>
                <p className={`text-[10px] text-center ${isPopular ? 'text-neutral-400' : 'text-neutral-400'}`}>
                  {plan.terms}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Inquiry / Checkout Modal */}
      {selectedPlanForInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/10 space-y-5 text-neutral-900">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                Sanctuary Enrollment
              </span>
              <h3 className="text-xl font-serif font-medium mt-1">
                {selectedPlanForInquiry.name}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                ${(selectedPlanForInquiry.price / 100).toFixed(2)} &bull; {selectedPlanForInquiry.billingPeriod}
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-4 border border-black/5 text-xs space-y-2">
              <p className="font-semibold text-neutral-900">How to finalize your pass:</p>
              <p className="text-neutral-600 leading-relaxed">
                Online gateway processing is configured for studio check-in. You can reserve any upcoming class spot now, and our reception team will link your {selectedPlanForInquiry.name} on your first visit.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPlanForInquiry(null)}
                className="py-2.5 px-4 rounded-full border border-black/10 text-xs font-medium text-neutral-600 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPlanForInquiry(null);
                  navigate('/schedule');
                }}
                className="flex-1 py-2.5 px-4 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 cursor-pointer"
              >
                Browse Schedule &amp; Reserve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison & Policy FAQ */}
      <div className="glass-panel rounded-3xl p-8 border border-black/8 space-y-6">
        <h3 className="text-xl font-serif font-medium text-neutral-900">
          Membership Guarantees &amp; Freedom
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600 leading-relaxed">
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Pause Anytime</h4>
            <p>
              Unlimited members may pause their pass for up to 30 calendar days per year for vacations, medical recovery, or work travel.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">No Long-Term Lock</h4>
            <p>
              Monthly memberships are month-to-month. Cancel anytime with a 7-day notice before your billing cycle resets.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Guest Passes Included</h4>
            <p>
              Bring a friend or family member to experience the sanctuary. Unlimited members receive 2 complimentary guest passes monthly.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
