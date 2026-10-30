import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="border-t border-black/10 bg-white/70 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-black/15 bg-white p-1 flex items-center justify-center">
                <img 
                  src="/public/assets/aistudio/image_2c9304de.png" 
                  alt="ASANA-Yoga" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-semibold text-neutral-900 uppercase tracking-widest text-xs font-serif">
                ASANA-Yoga
              </span>
            </div>
            <p className="text-neutral-500 leading-relaxed text-xs max-w-xs">
              A modern yoga and wellness studio dedicated to mindful movement, personalized class discovery, and authentic lineages in San Francisco.
            </p>
            <div className="text-[11px] text-neutral-400">
              © {new Date().getFullYear()} ASANA-Yoga LLC. All rights reserved.
            </div>
          </div>

          {/* Practice & Schedule */}
          <div className="space-y-3">
            <h4 className="text-neutral-900 font-semibold tracking-wider text-xs uppercase">Practice</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/classes')} className="hover:text-neutral-950 transition-colors cursor-pointer">
                  All Classes &amp; Styles
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/schedule')} className="hover:text-neutral-950 transition-colors cursor-pointer">
                  Weekly Schedule
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/instructors')} className="hover:text-neutral-950 transition-colors cursor-pointer">
                  Teaching Faculty
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/pricing')} className="hover:text-neutral-950 transition-colors cursor-pointer">
                  Memberships &amp; Packs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ai')} className="text-neutral-900 font-medium hover:underline flex items-center gap-1 cursor-pointer">
                  <span>ASANA Wellness Guide</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Sanctuary Info */}
          <div className="space-y-3">
            <h4 className="text-neutral-900 font-semibold tracking-wider text-xs uppercase">Sanctuary</h4>
            <ul className="space-y-2.5 text-neutral-500">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-neutral-700 shrink-0" />
                <span>428 Lotus Way, Zen Garden District, San Francisco, CA</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span>Daily: 6:30 AM – 9:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span>+1 (415) 555-0198</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span>sanctuary@asanayoga.wellness</span>
              </li>
            </ul>
          </div>

          {/* Ethics & Policies */}
          <div className="space-y-3">
            <h4 className="text-neutral-900 font-semibold tracking-wider text-xs uppercase">Policies</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-neutral-950 transition-colors cursor-pointer">
                  Studio Etiquette &amp; Attire
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-neutral-950 transition-colors cursor-pointer">
                  4-Hour Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-neutral-950 transition-colors cursor-pointer">
                  Studio Philosophy &amp; Mission
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-neutral-950 transition-colors cursor-pointer">
                  Contact &amp; Studio Inquiries
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>
            ASANA-Yoga honors traditional yoga practices with contemporary anatomical science. We do not provide clinical medical care.
          </p>
          <div className="flex gap-4">
            <span>Clean Living</span>
            <span>•</span>
            <span>Non-Violence (Ahimsa)</span>
            <span>•</span>
            <span>Accessible Movement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
