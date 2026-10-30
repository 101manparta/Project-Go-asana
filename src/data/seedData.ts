import { YogaClass, Instructor, YogaSession, MembershipPlan, StudioSettings, UserProfile } from '../types';

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Maya Lin',
    title: 'Lead Vinyasa & Breathwork Guide',
    shortBio: 'E-RYT 500 with 12 years of mindful movement practice across Mysore, Rishikesh, and California.',
    bio: 'Maya Lin began her journey in Rishikesh studying traditional Ashtanga and Pranayama. Her classes blend seamless somatic transitions with intentional breathwork, allowing students of all levels to discover effortless presence. She believes the mat is a mirror for how we meet life outside the studio.',
    specialties: ['Vinyasa Flow', 'Kundalini & Breathwork'],
    certifications: ['E-RYT 500 Yoga Alliance', 'Pranayama Master Certification', 'Somatic Stress Release Practitioner'],
    experienceYears: 12,
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    rating: 4.96,
    reviewsCount: 142
  },
  {
    id: 'inst-2',
    name: 'Julian Vance',
    title: 'Sound Alchemist & Yin Specialist',
    shortBio: 'Certified sound therapist and Yin yoga teacher combining crystal singing bowls with restorative holds.',
    bio: 'Julian creates an acoustic sanctuary where nervous systems downshift deeply. Integrating 432Hz crystal alchemy bowls with slow, supported Yin postures, Julian guides practitioners into parasympathetic restoration and emotional release.',
    specialties: ['Yin & Sound', 'Restorative & Nidra'],
    certifications: ['RYT 500 Yin Yoga Specialist', 'Certified Sound Practitioner (Globe Sound Healing Institute)', 'Yoga Nidra Facilitator'],
    experienceYears: 9,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    rating: 4.98,
    reviewsCount: 188
  },
  {
    id: 'inst-3',
    name: 'Elena Rostova',
    title: 'Ashtanga & Alignment Mentor',
    shortBio: 'Former contemporary dancer turned disciplined Ashtangi with rigorous anatomical precision.',
    bio: 'Elena brings biomechanical precision and anatomical safety into dynamic flow. Her classes emphasize joint stability, core integration, and sustainable progression, guiding both curious newcomers and advanced practitioners safely into inversions.',
    specialties: ['Ashtanga Primary', 'Power Vinyasa'],
    certifications: ['KPJAYI Authorized Level 1', 'FMT Movement Specialist', 'E-RYT 200'],
    experienceYears: 8,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    rating: 4.93,
    reviewsCount: 116
  },
  {
    id: 'inst-4',
    name: 'Kavi Sharma',
    title: 'Hatha Foundations & Meditation Teacher',
    shortBio: 'Third-generation classical yoga teacher focusing on grounding postures and mindful stillness.',
    bio: 'Born in Pune and raised around classical yogic traditions, Kavi teaches with gentleness, patience, and humor. He excels at breaking down fundamental asanas, making yoga accessible, demystified, and deeply grounding for modern urbanites.',
    specialties: ['Hatha Foundation', 'Restorative & Nidra'],
    certifications: ['Bihar School of Yoga Diploma', 'Mindfulness Meditation Teacher (MMTCP)', 'E-RYT 500'],
    experienceYears: 14,
    imageUrl: 'https://images.unsplash.com/photo-1552196563-552366372d0d?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    rating: 4.99,
    reviewsCount: 210
  }
];

export const INITIAL_CLASSES: YogaClass[] = [
  {
    id: 'class-vinyasa-flow',
    title: 'ASANA Solar Flow',
    slug: 'asana-solar-flow',
    description: 'An invigorating, breath-synchronized sequence designed to build graceful strength and mental focus.',
    longDescription: 'Connect movement with intentional breath in this uplifting solar practice. We begin with grounding breath awareness, transition into progressive Sun Salutations and standing warrior flows, build heat through core stability, and conclude with cool-down floor postures and deep savasana.',
    style: 'Vinyasa Flow',
    level: 'All Levels',
    durationMinutes: 60,
    price: 2800, // $28.00
    currency: 'USD',
    instructorIds: ['inst-1', 'inst-3'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    benefits: ['Cardiovascular endurance', 'Joint mobility', 'Stress reduction', 'Improved posture'],
    whatToBring: ['Yoga mat (rentals available)', 'Refillable water bottle', 'Light sweat towel'],
    cancellationPolicyHours: 4,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-10-20T08:00:00Z'
  },
  {
    id: 'class-yin-sound-bath',
    title: 'Yin & Sacred Sound Sanctuary',
    slug: 'yin-sound-sanctuary',
    description: 'Passive long-held floor postures enveloped by the acoustic resonance of 432Hz frosted crystal bowls.',
    longDescription: 'Surrender muscular effort and target the deep connective fascia, tendons, and ligaments. Each gentle posture is supported by organic bolsters, cork blocks, and weighted wool blankets, while crystal singing bowls guide your brainwaves into meditative alpha and theta frequencies.',
    style: 'Yin & Sound',
    level: 'All Levels',
    durationMinutes: 75,
    price: 3500, // $35.00
    currency: 'USD',
    instructorIds: ['inst-2'],
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    benefits: ['Deep parasympathetic reset', 'Fascial hydration', 'Improved sleep quality', 'Subtle energy alignment'],
    whatToBring: ['Comfortable warm layers', 'Warm socks', 'Eye pillow (optional)'],
    cancellationPolicyHours: 6,
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-10-22T08:00:00Z'
  },
  {
    id: 'class-ashtanga-primary',
    title: 'Ashtanga Primary Series Guided',
    slug: 'ashtanga-primary-guided',
    description: 'The classical Chikitsa series focusing on purification, internal heat, and structural realignment.',
    longDescription: 'Experience the rhythmic discipline of traditional Ashtanga Yoga with modern anatomical modifications. Students are guided through Suryanamaskara A & B, standing poses, seated twists, and finishing postures with a steady Ujjayi breath and focused Drishti.',
    style: 'Ashtanga Primary',
    level: 'Intermediate',
    durationMinutes: 75,
    price: 3000, // $30.00
    currency: 'USD',
    instructorIds: ['inst-3'],
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    benefits: ['Physical detoxification', 'Spinal decompressive strength', 'Unwavering focus', 'Core stamina'],
    whatToBring: ['Grip yoga mat', 'Hand towel', 'Empty stomach (2 hours before class)'],
    cancellationPolicyHours: 4,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-10-15T08:00:00Z'
  },
  {
    id: 'class-restorative-nidra',
    title: 'Deep Restorative & Yoga Nidra',
    slug: 'restorative-yoga-nidra',
    description: 'Zero-effort restorative postures followed by 30 minutes of guided yogic sleep for total renewal.',
    longDescription: 'The antidote to modern chronic fatigue. We utilize extensive props to hold restorative shapes for 10-15 minutes without any physical strain, culminating in guided Yoga Nidra that systematically invites conscious awareness through the physical, mental, and subtle koshas.',
    style: 'Restorative & Nidra',
    level: 'Beginner',
    durationMinutes: 60,
    price: 2800, // $28.00
    currency: 'USD',
    instructorIds: ['inst-2', 'inst-4'],
    imageUrl: 'https://images.unsplash.com/photo-1552196563-552366372d0d?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    benefits: ['Cortisol reduction', 'Nervous system recalibration', 'Relief from insomnia', 'Deep cellular rest'],
    whatToBring: ['Loose warm clothing', 'Eye covering', 'Warm socks'],
    cancellationPolicyHours: 4,
    createdAt: '2026-01-18T08:00:00Z',
    updatedAt: '2026-10-24T08:00:00Z'
  },
  {
    id: 'class-hatha-foundation',
    title: 'Hatha Alignment & Gentle Foundations',
    slug: 'hatha-foundations',
    description: 'Learn foundational asanas, mindful breathing mechanics, and posture modifications step-by-step.',
    longDescription: 'Ideal for those beginning their yoga journey or practitioners wishing to refine posture mechanics. We spend time breaking down fundamental alignment, hip openers, spinal twists, and safe weight-bearing techniques with individual attention.',
    style: 'Hatha Foundation',
    level: 'Beginner',
    durationMinutes: 60,
    price: 2500, // $25.00
    currency: 'USD',
    instructorIds: ['inst-4'],
    imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    benefits: ['Safe alignment principles', 'Flexibility improvement', 'Balance & proprioception', 'Confidence on the mat'],
    whatToBring: ['Yoga mat', 'Water bottle', 'Curiosity and open mind'],
    cancellationPolicyHours: 4,
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-10-25T08:00:00Z'
  },
  {
    id: 'class-kundalini-breath',
    title: 'Pranayama & Kundalini Awakening',
    slug: 'pranayama-kundalini',
    description: 'Dynamic breathwork kriya, spinal energy activation, and mantra chanting to clear mental stagnation.',
    longDescription: 'Unlock vital life force through rhythmic breathing exercises (Kapalabhati, Bhastrika), energetic locks (Bandhas), gentle spinal flexes, and restorative sound meditation. Perfect for clearing morning brain fog and restoring mental clarity.',
    style: 'Kundalini & Breathwork',
    level: 'All Levels',
    durationMinutes: 60,
    price: 2800, // $28.00
    currency: 'USD',
    instructorIds: ['inst-1'],
    imageUrl: 'https://images.unsplash.com/photo-1508215885820-4523e4313d7b?auto=format&fit=crop&w=1000&q=80',
    isPublished: true,
    benefits: ['Respiratory capacity', 'Mental focus & vitality', 'Emotional release', 'Energetic balance'],
    whatToBring: ['Meditation cushion (provided)', 'Light loose cottons', 'Water bottle'],
    cancellationPolicyHours: 4,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-10-26T08:00:00Z'
  }
];

// Helper to generate dynamic dates relative to current date (2026-10-29)
export const getSeededSessions = (): YogaSession[] => {
  const baseDate = new Date('2026-10-29T09:00:00Z');
  
  const createSessionDate = (dayOffset: number, hours: number, minutes: number) => {
    const d = new Date(baseDate);
    d.setUTCDate(d.getUTCDate() + dayOffset);
    d.setUTCHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  return [
    {
      id: 'sess-today-morning',
      classId: 'class-vinyasa-flow',
      classTitle: 'ASANA Solar Flow',
      instructorId: 'inst-1',
      instructorName: 'Maya Lin',
      instructorAvatar: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=200&q=80',
      startsAt: createSessionDate(0, 11, 0), // 11:00 AM Today
      endsAt: createSessionDate(0, 12, 0),
      timeZone: 'America/Los_Angeles',
      location: 'ASANA-Yoga Sanctuary - Studio A (Sun Room)',
      room: 'Sun Room',
      capacity: 18,
      bookedCount: 14,
      price: 2800,
      currency: 'USD',
      status: 'SCHEDULED',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'sess-today-evening',
      classId: 'class-yin-sound-bath',
      classTitle: 'Yin & Sacred Sound Sanctuary',
      instructorId: 'inst-2',
      instructorName: 'Julian Vance',
      instructorAvatar: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80',
      startsAt: createSessionDate(0, 18, 30), // 6:30 PM Today
      endsAt: createSessionDate(0, 19, 45),
      timeZone: 'America/Los_Angeles',
      location: 'ASANA-Yoga Sanctuary - Studio B (Acoustic Chamber)',
      room: 'Acoustic Chamber',
      capacity: 14,
      bookedCount: 13, // 1 spot left!
      price: 3500,
      currency: 'USD',
      status: 'SCHEDULED',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'sess-tomorrow-morning',
      classId: 'class-hatha-foundation',
      classTitle: 'Hatha Alignment & Gentle Foundations',
      instructorId: 'inst-4',
      instructorName: 'Kavi Sharma',
      instructorAvatar: 'https://images.unsplash.com/photo-1552196563-552366372d0d?auto=format&fit=crop&w=200&q=80',
      startsAt: createSessionDate(1, 8, 30), // 8:30 AM Tomorrow
      endsAt: createSessionDate(1, 9, 30),
      timeZone: 'America/Los_Angeles',
      location: 'ASANA-Yoga Sanctuary - Studio A (Sun Room)',
      room: 'Sun Room',
      capacity: 16,
      bookedCount: 8,
      price: 2500,
      currency: 'USD',
      status: 'SCHEDULED',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'sess-tomorrow-noon',
      classId: 'class-kundalini-breath',
      classTitle: 'Pranayama & Kundalini Awakening',
      instructorId: 'inst-1',
      instructorName: 'Maya Lin',
      instructorAvatar: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=200&q=80',
      startsAt: createSessionDate(1, 12, 0),
      endsAt: createSessionDate(1, 13, 0),
      timeZone: 'America/Los_Angeles',
      location: 'ASANA-Yoga Sanctuary - Studio A (Sun Room)',
      room: 'Sun Room',
      capacity: 18,
      bookedCount: 9,
      price: 2800,
      currency: 'USD',
      status: 'SCHEDULED',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'sess-tomorrow-evening',
      classId: 'class-restorative-nidra',
      classTitle: 'Deep Restorative & Yoga Nidra',
      instructorId: 'inst-2',
      instructorName: 'Julian Vance',
      instructorAvatar: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80',
      startsAt: createSessionDate(1, 19, 0),
      endsAt: createSessionDate(1, 20, 0),
      timeZone: 'America/Los_Angeles',
      location: 'ASANA-Yoga Sanctuary - Studio B (Acoustic Chamber)',
      room: 'Acoustic Chamber',
      capacity: 14,
      bookedCount: 11,
      price: 2800,
      currency: 'USD',
      status: 'SCHEDULED',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'sess-weekend-ashtanga',
      classId: 'class-ashtanga-primary',
      classTitle: 'Ashtanga Primary Series Guided',
      instructorId: 'inst-3',
      instructorName: 'Elena Rostova',
      instructorAvatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=200&q=80',
      startsAt: createSessionDate(2, 9, 0), // Saturday 9:00 AM
      endsAt: createSessionDate(2, 10, 15),
      timeZone: 'America/Los_Angeles',
      location: 'ASANA-Yoga Sanctuary - Studio A (Sun Room)',
      room: 'Sun Room',
      capacity: 16,
      bookedCount: 16, // FULLY BOOKED! Capacity test
      price: 3000,
      currency: 'USD',
      status: 'SCHEDULED',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'sess-weekend-yin',
      classId: 'class-yin-sound-bath',
      classTitle: 'Yin & Sacred Sound Sanctuary',
      instructorId: 'inst-2',
      instructorName: 'Julian Vance',
      instructorAvatar: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=200&q=80',
      startsAt: createSessionDate(2, 16, 0), // Saturday 4:00 PM
      endsAt: createSessionDate(2, 17, 15),
      timeZone: 'America/Los_Angeles',
      location: 'ASANA-Yoga Sanctuary - Studio B (Acoustic Chamber)',
      room: 'Acoustic Chamber',
      capacity: 14,
      bookedCount: 7,
      price: 3500,
      currency: 'USD',
      status: 'SCHEDULED',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'sess-sunday-solar',
      classId: 'class-vinyasa-flow',
      classTitle: 'ASANA Solar Flow',
      instructorId: 'inst-1',
      instructorName: 'Maya Lin',
      instructorAvatar: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=200&q=80',
      startsAt: createSessionDate(3, 10, 0), // Sunday 10:00 AM
      endsAt: createSessionDate(3, 11, 0),
      timeZone: 'America/Los_Angeles',
      location: 'ASANA-Yoga Sanctuary - Studio A (Sun Room)',
      room: 'Sun Room',
      capacity: 18,
      bookedCount: 12,
      price: 2800,
      currency: 'USD',
      status: 'SCHEDULED',
      createdAt: '2026-10-20T10:00:00Z'
    }
  ];
};

export const INITIAL_MEMBERSHIPS: MembershipPlan[] = [
  {
    id: 'plan-single',
    name: 'Drop-In Session',
    description: 'Perfect for spontaneous visits and travelers seeking single-session renewal.',
    price: 2800, // $28.00
    currency: 'USD',
    billingPeriod: 'SINGLE',
    classCredits: 1,
    isUnlimited: false,
    features: [
      'Access to any standard 60-min class',
      'Mat & organic towel included',
      'Infused herbal tea after practice',
      'Valid for 30 days from purchase'
    ],
    terms: 'Non-refundable once reserved. 4-hour cancellation window applies.',
    isActive: true
  },
  {
    id: 'plan-5-pack',
    name: '5-Class Sanctuary Pack',
    description: 'Flexible commitment for building a steady twice-weekly rhythm.',
    price: 12500, // $125.00 ($25/class)
    currency: 'USD',
    billingPeriod: 'PACK',
    classCredits: 5,
    isUnlimited: false,
    popular: false,
    features: [
      '5 flexible class credits ($25/class saving)',
      'Valid across all yoga styles & sound baths',
      'Priority booking window (7 days in advance)',
      '1 complimentary guest pass',
      'Valid for 90 days'
    ],
    terms: 'Credits expire 90 days after activation. Cannot be shared except via guest pass.',
    isActive: true
  },
  {
    id: 'plan-unlimited-monthly',
    name: 'ASANA Unlimited Membership',
    description: 'Our signature tier for dedicated yogis seeking complete freedom and sanctuary access.',
    price: 18900, // $189.00/mo
    currency: 'USD',
    billingPeriod: 'MONTHLY',
    classCredits: 0,
    isUnlimited: true,
    popular: true,
    features: [
      'Unlimited access to all daily classes & sound baths',
      '14-day advance booking priority',
      'Free mat storage & private locker locker access',
      '2 free guest passes per month',
      '15% off weekend workshops & retail apothecary',
      'Access to recorded library & ASANA Wellness Guide'
    ],
    terms: 'Billed monthly. Pause up to 30 days per year. Cancel anytime with 7 days notice.',
    isActive: true
  },
  {
    id: 'plan-10-pack',
    name: '10-Class Committed Pack',
    description: 'Exceptional value for regular practitioners who manage dynamic schedules.',
    price: 23000, // $230.00 ($23/class)
    currency: 'USD',
    billingPeriod: 'PACK',
    classCredits: 10,
    isUnlimited: false,
    popular: false,
    features: [
      '10 class credits ($23/class best pack value)',
      'Valid for all classes including special 75-min sound baths',
      'Priority booking window (10 days in advance)',
      '2 complimentary guest passes',
      'Valid for 6 months'
    ],
    terms: 'Credits expire 180 days after activation.',
    isActive: true
  }
];

export const INITIAL_STUDIO_SETTINGS: StudioSettings = {
  studioName: 'ASANA-Yoga',
  tagline: 'Move Mindfully. Live Fully.',
  address: '428 Lotus Way, Zen Garden District, San Francisco, CA 94102',
  phone: '+1 (415) 555-0198',
  email: 'sanctuary@asanayoga.wellness',
  whatsapp: '+14155550198',
  businessHours: 'Mon - Fri: 6:30 AM – 9:00 PM | Sat - Sun: 7:30 AM – 8:00 PM',
  defaultTimeZone: 'America/Los_Angeles',
  currency: 'USD',
  cancellationWindowHours: 4,
  aiAssistantEnabled: true,
  aiModelName: 'gemini-2.5-flash',
  aiSystemInstruction: `You are the ASANA Wellness Guide for ASANA-Yoga. You are a calm, grounded, attentive guide who assists visitors with discovering classes, matching individual needs (injuries, stress, flexibility, beginner status), and checking schedules. Ground all class recommendations in real studio offerings. Never give medical diagnoses. When users want to book, summarize details clearly and prompt for their confirmation.`,
  announcementBanner: {
    enabled: true,
    message: 'Autumn Equinox Sound Bath & Candlelight Flow reservations are now open at ASANA-Yoga.'
  }
};

export const INITIAL_USER: UserProfile = {
  uid: 'usr-demo-customer',
  email: 'manparta0101@gmail.com',
  displayName: 'Arya Sen',
  role: 'CUSTOMER',
  phone: '+1 (555) 234-5678',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  preferences: {
    experienceLevel: 'All Levels',
    preferredStyles: ['Vinyasa Flow', 'Yin & Sound'],
    goals: ['Stress Reduction', 'Spinal Mobility', 'Better Sleep']
  },
  membershipId: 'plan-5-pack',
  membershipName: '5-Class Sanctuary Pack',
  remainingCredits: 3,
  createdAt: '2026-08-15T10:00:00Z',
  accountStatus: 'ACTIVE'
};

export const INITIAL_ADMIN_USER: UserProfile = {
  uid: 'usr-admin-master',
  email: 'admin@asanayoga.wellness',
  displayName: 'Studio Director Sarah',
  role: 'SUPER_ADMIN',
  phone: '+1 (415) 555-0100',
  avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  createdAt: '2025-01-01T00:00:00Z',
  accountStatus: 'ACTIVE'
};

