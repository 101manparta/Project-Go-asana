import React, { useState } from 'react';
import { Search, ChevronDown, MessageSquare } from 'lucide-react';

interface FAQProps {
  navigate: (route: string) => void;
}

export const FAQ: React.FC<FAQProps> = ({ navigate }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      category: 'Booking & Capacity',
      q: 'How does real-time seat reservation work?',
      a: 'Our booking system enforces hard capacity limits (14 to 18 mats per room) on the server. When you book, your spot is atomically locked, eliminating overcrowded rooms.'
    },
    {
      category: 'Booking & Capacity',
      q: 'Can I cancel or reschedule if my day changes?',
      a: 'Yes. You can cancel any booked class up to 4 hours prior to the session start time directly in your account dashboard. Your class credit will be immediately refunded.'
    },
    {
      category: 'Studio Etiquette',
      q: 'What should I wear and bring to my session?',
      a: 'Wear comfortable, non-restrictive clothing that moves with you. We recommend bringing a water bottle. We provide complimentary studio mats, organic bolsters, eye pillows, and blocks.'
    },
    {
      category: 'Studio Etiquette',
      q: 'What time should I arrive before class begins?',
      a: 'Please arrive 10 to 15 minutes before the scheduled start time. To preserve deep stillness, studio doors are locked promptly once class starts and late entry is not permitted.'
    },
    {
      category: 'Memberships',
      q: 'Can I share my 5-Pack or 10-Pack with a friend?',
      a: 'Class packs are tied to an individual account; however, each 5-Pack and 10-Pack includes 1 or 2 complimentary guest passes you can use to bring a guest alongside you.'
    },
    {
      category: 'ASANA Wellness Guide',
      q: 'How does the ASANA Wellness Guide make recommendations?',
      a: 'The ASANA Wellness Guide cross-references your physical intentions, schedule, and beginner/intermediate level with our live database of scheduled classes and instructors. It does not provide medical diagnoses.'
    }
  ];

  const categories = ['ALL', 'Booking & Capacity', 'Studio Etiquette', 'Memberships', 'ASANA Wellness Guide'];

  const filteredFaqs = faqData.filter(item => {
    const matchCat = activeCategory === 'ALL' || item.category === activeCategory;
    const matchSearch = item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-neutral-800 text-xs font-medium">
          <span>Sanctuary Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-neutral-900">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-neutral-600 font-light max-w-lg mx-auto leading-relaxed">
          Everything you need to know regarding studio policies, etiquette, mat reservations, and memberships.
        </p>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. cancellation, mats, beginner)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-black/10 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white font-medium shadow-xs'
                  : 'bg-white border border-black/10 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {cat === 'ALL' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 text-center text-xs text-neutral-500">
            No matching questions found. Ask our AI Guide or contact our front desk!
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl border border-black/8 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-medium text-neutral-900 cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-black/5">
                    <p className="mt-2">{faq.a}</p>
                    <span className="inline-block mt-3 text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Need more help CTA */}
      <div className="glass-panel rounded-3xl p-6 border border-black/8 text-center space-y-3">
        <p className="text-xs text-neutral-700 font-medium">Still have an unanswered question?</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/ai')}
            className="px-4 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask ASANA Wellness Guide</span>
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-4 py-2 rounded-full border border-black/10 text-neutral-800 text-xs font-medium hover:bg-neutral-100 cursor-pointer"
          >
            Contact Reception
          </button>
        </div>
      </div>

    </div>
  );
};
