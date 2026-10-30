import React, { useState } from 'react';
import { 
  MessageSquare, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Check, 
  ChevronDown, 
  Compass, 
  HeartHandshake, 
  Wind, 
  Flame, 
  Feather,
  Star
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { ClassCard } from '../components/ClassCard';
import { InstructorCard } from '../components/InstructorCard';

interface HomeProps {
  navigate: (route: string) => void;
}

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  const { classes, sessions, instructors, openBookingModal } = useStudio();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredClasses = classes.slice(0, 3);
  const todaySessions = sessions.slice(0, 4);
  const featuredInstructors = instructors.slice(0, 3);

  const faqs = [
    {
      q: 'How does class booking work at ASANA-Yoga?',
      a: 'Browse our class catalog or weekly schedule, choose your preferred style and time, and reserve your mat in under 30 seconds. Your spot is immediately guaranteed in our studio capacity system.'
    },
    {
      q: 'What is your cancellation policy?',
      a: 'We understand schedules shift. You can cancel or reschedule any standard class up to 4 hours prior with zero penalty, and your credit will be automatically refunded to your account.'
    },
    {
      q: 'What should I bring to my first class?',
      a: 'We provide complimentary natural rubber mats, organic cotton bolsters, and cork blocks. We recommend wearing breathable clothing and bringing a refillable water bottle.'
    },
    {
      q: 'How does the ASANA Wellness Guide assist me?',
      a: 'Our grounded wellness guide analyzes your physical state, fatigue levels, schedule, and experience level to recommend real, currently scheduled classes and instructors that match your goals.'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 text-neutral-800 text-xs font-medium border border-black/5">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              <span>San Francisco Studio &bull; Now Open for Fall Season</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-neutral-950 leading-[1.12]">
              Move Mindfully. <br />
              <span className="italic font-light text-neutral-700">Live Fully.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-xl font-light leading-relaxed">
              Discover your practice, find your balance, and make space for a healthier lifestyle with ASANA-Yoga.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/classes')}
                className="px-7 py-3.5 rounded-full bg-neutral-950 text-white text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                <span>Explore Classes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/ai')}
                className="px-6 py-3.5 rounded-full glass-panel text-neutral-900 text-xs sm:text-sm font-medium hover:bg-neutral-100 transition-all flex items-center gap-2 border border-black/10 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-neutral-700" />
                <span>ASANA Wellness Guide</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-black/10 max-w-md">
              <div>
                <span className="text-2xl font-serif font-medium text-neutral-900 block">75+</span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider">Weekly Classes</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-medium text-neutral-900 block">4.96</span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider">Avg Rating</span>
              </div>
              <div>
                <span className="text-2xl font-serif font-medium text-neutral-900 block">18 Max</span>
                <span className="text-[11px] text-neutral-500 uppercase tracking-wider">Intimate Mats</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (Glassmorphism & Line Art Asset) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glass Card Container */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-black/10 shadow-xl relative overflow-hidden bg-white/70">
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-b from-neutral-50 to-white flex items-center justify-center p-8 border border-black/5 relative group">
                  <img
                    src="/public/assets/aistudio/image_2c9304de.png"
                    alt="ASANA-Yoga Abstract Posture Line Art"
                    className="w-full h-full object-contain filter contrast-125 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 text-[10px] tracking-widest uppercase text-neutral-400 font-mono">
                    Fig. 01 / Alignment &bull; Stillness
                  </div>
                </div>

                {/* Floating Guide Helper Preview Badge */}
                <div 
                  onClick={() => navigate('/ai')}
                  className="mt-5 p-3.5 rounded-2xl bg-white/90 border border-black/10 flex items-center justify-between cursor-pointer hover:border-black/30 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-neutral-100 text-neutral-800 flex items-center justify-center">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">Need class recommendations?</p>
                      <p className="text-[11px] text-neutral-500">&ldquo;Recommend a gentle evening unwind...&rdquo;</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. UPCOMING SESSIONS TODAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
              Live Studio Schedule
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900 mt-1">
              Upcoming Sessions Available
            </h2>
          </div>
          <button
            onClick={() => navigate('/schedule')}
            className="text-xs font-medium text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Weekly Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {todaySessions.map((session) => {
            const seatsLeft = session.capacity - session.bookedCount;
            const isFull = seatsLeft <= 0;

            return (
              <div
                key={session.id}
                className="glass-card rounded-2xl p-5 border border-black/8 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span className="font-medium text-neutral-800">
                      {new Date(session.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isFull 
                        ? 'bg-neutral-100 text-neutral-500' 
                        : seatsLeft <= 2 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {isFull ? 'Sold Out' : `${seatsLeft} spots left`}
                    </span>
                  </div>

                  <h3 className="font-serif font-medium text-base text-neutral-900 line-clamp-1">
                    {session.classTitle}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    {session.instructorAvatar && (
                      <img
                        src={session.instructorAvatar}
                        alt={session.instructorName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    <span>{session.instructorName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900">
                    ${(session.price / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => openBookingModal(session)}
                    disabled={isFull}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      isFull
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                  >
                    {isFull ? 'Waitlist' : 'Reserve Spot'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED YOGA CLASSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
            Signature Lineages
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-900">
            Curated Classes for Body &amp; Mind
          </h2>
          <p className="text-sm text-neutral-600 font-light">
            Each practice is designed with somatic integrity, anatomical safety, and authentic yogic philosophies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredClasses.map((c) => (
            <ClassCard
              key={c.id}
              yogaClass={c}
              onSelect={(id) => navigate(`/classes/${id}`)}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/classes')}
            className="px-6 py-3 rounded-full border border-black/15 text-xs font-medium text-neutral-900 hover:bg-neutral-100 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>View All {classes.length} Classes &amp; Styles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4. HOW BOOKING WORKS (Calm 3-Step Flow) */}
      <section className="bg-white/60 border-y border-black/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
              Effortless Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900">
              How Reservation Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-black/5 space-y-3">
              <span className="text-xs font-mono font-bold text-neutral-400">01</span>
              <h3 className="text-base font-serif font-medium text-neutral-900">Choose Your Practice</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Filter by yoga style, experience level, or let our AI guide discover a session aligned with your daily energy.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-black/5 space-y-3">
              <span className="text-xs font-mono font-bold text-neutral-400">02</span>
              <h3 className="text-base font-serif font-medium text-neutral-900">Instant Seat Reservation</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Review available mats in real time. We strictly cap classes at 14–18 students to preserve personal attention and sacred space.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-black/5 space-y-3">
              <span className="text-xs font-mono font-bold text-neutral-400">03</span>
              <h3 className="text-base font-serif font-medium text-neutral-900">Arrive &amp; Unwind</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Walk in, drop your shoes, and step onto your prepared mat. Enjoy herbal infusions in our lounge after class.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ASANA WELLNESS GUIDE FEATURE HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-black/10 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-black/5">
                <MessageSquare className="w-3.5 h-3.5 text-neutral-700" />
                <span>ASANA Wellness Guide</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-950">
                A Practice That Listens to How You Feel Today
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
                Not every day calls for a vigorous flow. Tell our ASANA Wellness Guide if you have tight hamstrings, work fatigue, or desire gentle breathwork. It cross-references real studio schedules to find your optimal session.
              </p>

              {/* Clickable prompt starters */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-neutral-700">Try asking our Wellness Guide:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "I'm new to yoga, what beginner class is best?",
                    "Looking for deep relaxation & sound bowls tonight",
                    "Classes with open seats this weekend",
                    "Show classes under $30 with Maya Lin"
                  ].map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => navigate('/ai')}
                      className="text-xs px-3 py-1.5 rounded-full bg-white border border-black/10 hover:border-black/30 hover:bg-neutral-50 transition-colors text-neutral-800 text-left cursor-pointer"
                    >
                      &ldquo;{promptText}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/ai')}
                  className="px-6 py-3 rounded-full bg-neutral-950 text-white text-xs font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Consult ASANA Wellness Guide</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-neutral-50/90 rounded-2xl p-6 border border-black/8 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-black/5">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900">ASANA Wellness Guide</h4>
                  <span className="text-[10px] text-neutral-500 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Grounded in studio schedule
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-xl rounded-tl-xs text-neutral-800 border border-black/5">
                  &ldquo;I spent 8 hours at my desk and my lower back feels stiff. What class should I attend?&rdquo;
                </div>
                <div className="p-3 bg-neutral-100/90 border border-black/5 rounded-xl rounded-tr-xs text-neutral-900 space-y-1.5">
                  <p>
                    I recommend <strong>Yin &amp; Sacred Sound Sanctuary</strong> tonight at 6:30 PM. It features gentle passive hip openers and lumbar traction, accompanied by 432Hz crystal bowls.
                  </p>
                  <div className="p-2 bg-white rounded-lg border border-black/5 flex items-center justify-between text-[11px]">
                    <span>1 spot remaining with Julian Vance</span>
                    <span className="font-semibold">$35.00</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. INSTRUCTOR HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
              Authentic Faculty
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900 mt-1">
              Experienced Lineage Mentors
            </h2>
          </div>
          <button
            onClick={() => navigate('/instructors')}
            className="text-xs font-medium text-neutral-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Instructors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredInstructors.map((inst) => (
            <InstructorCard
              key={inst.id}
              instructor={inst}
              onSelect={(id) => navigate(`/instructors/${id}`)}
              onViewSchedule={() => navigate('/schedule')}
            />
          ))}
        </div>
      </section>

      {/* 7. STUDIO ATMOSPHERE GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
            The Sanctuary
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900">
            A Mindful Architectural Space
          </h2>
          <p className="text-xs text-neutral-500 font-light">
            Natural cedarwood, diffused skylights, and acoustic insulation to shield you from urban distraction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative h-64 rounded-3xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"
              alt="Studio Sun Room"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-[10px] tracking-wider uppercase text-neutral-300">Studio A</span>
              <h4 className="text-sm font-medium font-serif">Sun Room &amp; Skylights</h4>
            </div>
          </div>

          <div className="relative h-64 rounded-3xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
              alt="Sound Healing Chamber"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-[10px] tracking-wider uppercase text-neutral-300">Studio B</span>
              <h4 className="text-sm font-medium font-serif">Acoustic Sound Chamber</h4>
            </div>
          </div>

          <div className="relative h-64 rounded-3xl overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1552196563-552366372d0d?auto=format&fit=crop&w=800&q=80"
              alt="Apothecary & Tea Lounge"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-[10px] tracking-wider uppercase text-neutral-300">Lounge</span>
              <h4 className="text-sm font-medium font-serif">Apothecary &amp; Organic Herbal Tea</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="bg-neutral-50/80 border-y border-black/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
              Practitioner Reflections
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900">
              In Their Own Words
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The acoustic sound chamber with Julian is truly unlike any yoga studio in San Francisco. My nervous system was completely recalibrated.",
                author: "Clara Vance",
                role: "Member since 2025"
              },
              {
                quote: "Being able to ask the ASANA Wellness Guide for a class matching my wrist injury saved me so much hesitation. The Hatha Foundations class was impeccable.",
                author: "Marcus Brody",
                role: "5-Class Pack Holder"
              },
              {
                quote: "The small 16-mat limit means teachers actually see your alignment. You never feel like a number in an overcrowded gym class.",
                author: "Evelyn K.",
                role: "Unlimited Member"
              }
            ].map((t, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 border border-black/5 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-2 border-t border-black/5">
                  <p className="text-xs font-semibold text-neutral-900">{t.author}</p>
                  <p className="text-[11px] text-neutral-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-neutral-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl border border-black/5 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-medium text-neutral-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-black/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL BOOKING CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel-dark p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
              Begin Your Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight text-white">
              Step onto the Mat Today
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-lg mx-auto leading-relaxed">
              Experience the tranquility of conscious movement. Choose your first class with confidence, supported by our warm community.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/classes')}
                className="px-8 py-3.5 rounded-full bg-white text-neutral-950 text-xs sm:text-sm font-medium hover:bg-neutral-100 transition-colors cursor-pointer shadow-sm"
              >
                Book Your Mat Now
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-3.5 rounded-full border border-white/20 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
              >
                Explore Memberships
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
