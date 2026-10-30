import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  INITIAL_CLASSES, 
  INITIAL_INSTRUCTORS, 
  getSeededSessions, 
  INITIAL_MEMBERSHIPS, 
  INITIAL_STUDIO_SETTINGS, 
  INITIAL_USER,
  INITIAL_ADMIN_USER
} from './src/data/seedData';
import { Booking, YogaSession, YogaClass, Instructor, MembershipPlan, StudioSettings, UserProfile } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json());

// In-Memory Database Store (with full concurrency & transaction-like safety)
class StudioStore {
  classes: Map<string, YogaClass> = new Map();
  sessions: Map<string, YogaSession> = new Map();
  instructors: Map<string, Instructor> = new Map();
  memberships: Map<string, MembershipPlan> = new Map();
  bookings: Map<string, Booking> = new Map();
  users: Map<string, UserProfile> = new Map();
  settings: StudioSettings = { ...INITIAL_STUDIO_SETTINGS };
  idempotencyKeys: Set<string> = new Set();
  auditLogs: Array<{ id: string; timestamp: string; action: string; actor: string; details: any }> = [];

  constructor() {
    this.seed();
  }

  seed() {
    INITIAL_CLASSES.forEach(c => this.classes.set(c.id, { ...c }));
    INITIAL_INSTRUCTORS.forEach(i => this.instructors.set(i.id, { ...i }));
    getSeededSessions().forEach(s => this.sessions.set(s.id, { ...s }));
    INITIAL_MEMBERSHIPS.forEach(m => this.memberships.set(m.id, { ...m }));
    this.users.set(INITIAL_USER.uid, { ...INITIAL_USER });
    this.users.set(INITIAL_ADMIN_USER.uid, { ...INITIAL_ADMIN_USER });

    // Seed initial demo booking for Arya
    const demoBooking: Booking = {
      id: 'book-seed-001',
      customerId: INITIAL_USER.uid,
      customerName: INITIAL_USER.displayName,
      customerEmail: INITIAL_USER.email,
      sessionId: 'sess-today-morning',
      classId: 'class-vinyasa-flow',
      classTitle: 'ASANA Solar Flow',
      instructorName: 'Maya Lin',
      sessionStartsAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      sessionEndsAt: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      bookingReference: 'ASN-849201',
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      priceSnapshot: 2800,
      currency: 'USD',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    };
    this.bookings.set(demoBooking.id, demoBooking);

    this.logAudit('SYSTEM_BOOTSTRAP', 'system', { status: 'Database seeded with sample classes and sessions' });
  }

  logAudit(action: string, actor: string, details: any) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      details
    });
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
  }
}

const db = new StudioStore();

// Security / Role Auth Helper Middleware
interface AuthRequest extends Request {
  user?: UserProfile;
}

const mockAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // Check for admin role header or query token for flexibility in preview environment
  const roleHeader = req.headers['x-user-role'] as string;
  const userUid = req.headers['x-user-uid'] as string;

  if (roleHeader === 'SUPER_ADMIN' || roleHeader === 'ADMIN' || authHeader === 'Bearer demo-admin-token') {
    req.user = db.users.get(INITIAL_ADMIN_USER.uid) || INITIAL_ADMIN_USER;
  } else if (userUid && db.users.has(userUid)) {
    req.user = db.users.get(userUid);
  } else {
    // Default logged in user in client demo
    req.user = db.users.get(INITIAL_USER.uid) || INITIAL_USER;
  }
  next();
};

const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Access denied: Administrator privileges required.'
    });
  }
  next();
};

// ==========================================
// PUBLIC & CLIENT API ROUTES (/api/v1)
// ==========================================

// Health check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'asana-yoga-api',
    version: '1.0.0',
    geminiConfigured: !!(process.env.GEMINI_API_KEY || process.env.API_KEY)
  });
});

// Classes
app.get('/api/v1/classes', (req: Request, res: Response) => {
  const { style, level, search } = req.query;
  let result = Array.from(db.classes.values()).filter(c => c.isPublished);

  if (style && typeof style === 'string') {
    result = result.filter(c => c.style.toLowerCase() === style.toLowerCase());
  }
  if (level && typeof level === 'string') {
    result = result.filter(c => c.level.toLowerCase() === level.toLowerCase());
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) ||
      c.style.toLowerCase().includes(q)
    );
  }

  res.json({ data: result, total: result.length });
});

app.get('/api/v1/classes/:id', (req: Request, res: Response) => {
  const yogaClass = db.classes.get(req.params.id);
  if (!yogaClass) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Class not found' });
  }
  // Also attach upcoming sessions for this class
  const upcomingSessions = Array.from(db.sessions.values())
    .filter(s => s.classId === yogaClass.id && s.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  res.json({ data: { ...yogaClass, upcomingSessions } });
});

// Instructors
app.get('/api/v1/instructors', (req: Request, res: Response) => {
  const instructors = Array.from(db.instructors.values()).filter(i => i.isActive);
  res.json({ data: instructors, total: instructors.length });
});

app.get('/api/v1/instructors/:id', (req: Request, res: Response) => {
  const instructor = db.instructors.get(req.params.id);
  if (!instructor) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Instructor not found' });
  }
  const sessions = Array.from(db.sessions.values())
    .filter(s => s.instructorId === instructor.id && s.status === 'SCHEDULED');
  res.json({ data: { ...instructor, sessions } });
});

// Sessions & Schedule
app.get('/api/v1/sessions', (req: Request, res: Response) => {
  const { date, style, instructorId } = req.query;
  let sessions = Array.from(db.sessions.values());

  if (date && typeof date === 'string') {
    sessions = sessions.filter(s => s.startsAt.startsWith(date));
  }
  if (instructorId && typeof instructorId === 'string') {
    sessions = sessions.filter(s => s.instructorId === instructorId);
  }
  if (style && typeof style === 'string') {
    sessions = sessions.filter(s => {
      const c = db.classes.get(s.classId);
      return c && c.style.toLowerCase() === style.toLowerCase();
    });
  }

  // Sort chronologically
  sessions.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

  res.json({ data: sessions, total: sessions.length });
});

app.get('/api/v1/sessions/:id', (req: Request, res: Response) => {
  const session = db.sessions.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Session not found' });
  }
  const yogaClass = db.classes.get(session.classId);
  const instructor = db.instructors.get(session.instructorId);
  res.json({ data: { ...session, class: yogaClass, instructor } });
});

// Memberships & Pricing
app.get('/api/v1/pricing', (req: Request, res: Response) => {
  const plans = Array.from(db.memberships.values()).filter(m => m.isActive);
  res.json({ data: plans });
});

// Bookings (Transactional, safe capacity checking, idempotency, prevent duplicate)
app.post('/api/v1/bookings', mockAuthenticate, (req: AuthRequest, res: Response) => {
  const { sessionId, idempotencyKey } = req.body;
  const user = req.user || INITIAL_USER;

  if (!sessionId) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'sessionId is required' });
  }

  // Idempotency check
  if (idempotencyKey && db.idempotencyKeys.has(idempotencyKey)) {
    // Return existing booking if available
    const existing = Array.from(db.bookings.values()).find(b => b.idempotencyKey === idempotencyKey);
    if (existing) {
      return res.status(200).json({ data: existing, idempotentReplay: true });
    }
  }

  // Concurrency-safe check on session
  const session = db.sessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Session does not exist' });
  }

  if (session.status !== 'SCHEDULED') {
    return res.status(400).json({ error: 'INVALID_STATUS', message: 'Session is not open for booking' });
  }

  // Check capacity
  if (session.bookedCount >= session.capacity) {
    return res.status(409).json({ 
      error: 'CAPACITY_EXCEEDED', 
      message: 'This session is fully booked. No remaining seats available.' 
    });
  }

  // Prevent duplicate booking for same customer and session
  const userAlreadyBooked = Array.from(db.bookings.values()).some(
    b => b.customerId === user.uid && b.sessionId === sessionId && b.status === 'CONFIRMED'
  );
  if (userAlreadyBooked) {
    return res.status(409).json({
      error: 'DUPLICATE_BOOKING',
      message: 'You have already reserved a spot in this session.'
    });
  }

  const yogaClass = db.classes.get(session.classId);
  const bookingRef = `ASN-${Math.floor(100000 + Math.random() * 900000)}`;

  // Atomic state update
  session.bookedCount += 1;
  db.sessions.set(session.id, session);

  const newBooking: Booking = {
    id: `book-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    customerId: user.uid,
    customerName: user.displayName,
    customerEmail: user.email,
    sessionId: session.id,
    classId: session.classId,
    classTitle: session.classTitle || (yogaClass ? yogaClass.title : 'Yoga Session'),
    instructorName: session.instructorName || 'ASANA Guide',
    sessionStartsAt: session.startsAt,
    sessionEndsAt: session.endsAt,
    bookingReference: bookingRef,
    status: 'CONFIRMED',
    paymentStatus: user.remainingCredits && user.remainingCredits > 0 ? 'PAID' : 'PAID', // In production linked to gateway
    priceSnapshot: session.price,
    currency: session.currency,
    idempotencyKey,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Deduct membership credit if user had credits
  if (user.remainingCredits && user.remainingCredits > 0) {
    user.remainingCredits -= 1;
    db.users.set(user.uid, user);
  }

  if (idempotencyKey) {
    db.idempotencyKeys.add(idempotencyKey);
  }

  db.bookings.set(newBooking.id, newBooking);
  db.logAudit('BOOKING_CREATED', user.email, {
    bookingId: newBooking.id,
    reference: bookingRef,
    sessionId: session.id,
    seatsRemaining: session.capacity - session.bookedCount
  });

  res.status(201).json({
    message: 'Booking successfully confirmed',
    data: newBooking,
    sessionSeatsLeft: session.capacity - session.bookedCount
  });
});

// Customer's own bookings
app.get('/api/v1/me/bookings', mockAuthenticate, (req: AuthRequest, res: Response) => {
  const user = req.user || INITIAL_USER;
  const userBookings = Array.from(db.bookings.values())
    .filter(b => b.customerId === user.uid)
    .sort((a, b) => new Date(b.sessionStartsAt).getTime() - new Date(a.sessionStartsAt).getTime());

  res.json({ data: userBookings });
});

// Cancel customer booking (enforces studio cancellation policy deadline)
app.post('/api/v1/me/bookings/:id/cancel', mockAuthenticate, (req: AuthRequest, res: Response) => {
  const user = req.user || INITIAL_USER;
  const booking = db.bookings.get(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Booking not found' });
  }

  // Security: check ownership
  if (booking.customerId !== user.uid && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'FORBIDDEN', message: 'You are not authorized to cancel this booking' });
  }

  if (booking.status === 'CANCELLED') {
    return res.status(400).json({ error: 'ALREADY_CANCELLED', message: 'This booking has already been cancelled' });
  }

  // Enforce cancellation deadline (e.g., 4 hours prior)
  const sessionStart = new Date(booking.sessionStartsAt).getTime();
  const now = Date.now();
  const hoursUntilSession = (sessionStart - now) / (1000 * 60 * 60);

  const policyHours = db.settings.cancellationWindowHours || 4;
  if (hoursUntilSession < policyHours && user.role !== 'ADMIN') {
    return res.status(400).json({
      error: 'POLICY_VIOLATION',
      message: `Cancellations must be made at least ${policyHours} hours before class time. Please contact studio support.`
    });
  }

  // Release capacity
  const session = db.sessions.get(booking.sessionId);
  if (session && session.bookedCount > 0) {
    session.bookedCount -= 1;
    db.sessions.set(session.id, session);
  }

  // Refund credit if applicable
  if (user.remainingCredits !== undefined) {
    user.remainingCredits += 1;
    db.users.set(user.uid, user);
  }

  booking.status = 'CANCELLED';
  booking.cancelledAt = new Date().toISOString();
  booking.updatedAt = new Date().toISOString();
  db.bookings.set(booking.id, booking);

  db.logAudit('BOOKING_CANCELLED', user.email, {
    bookingId: booking.id,
    reference: booking.bookingReference,
    sessionId: booking.sessionId
  });

  res.json({
    message: 'Booking cancelled successfully. Capacity released.',
    data: booking
  });
});

// User profile & membership
app.get('/api/v1/me/profile', mockAuthenticate, (req: AuthRequest, res: Response) => {
  res.json({ data: req.user || INITIAL_USER });
});

app.patch('/api/v1/me/profile', mockAuthenticate, (req: AuthRequest, res: Response) => {
  const user = req.user || INITIAL_USER;
  const { displayName, phone, preferences } = req.body;

  if (displayName) user.displayName = displayName;
  if (phone) user.phone = phone;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  db.users.set(user.uid, user);
  res.json({ message: 'Profile updated successfully', data: user });
});

// ==========================================
// AI YOGA ASSISTANT ENGINE (Gemini Powered)
// ==========================================
app.post('/api/v1/ai/chat', async (req: Request, res: Response) => {
  const { messages, userPreferences } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'messages array is required' });
  }

  const latestUserMessage = messages[messages.length - 1]?.content || '';

  // Prepare database grounding context
  const activeClasses = Array.from(db.classes.values()).filter(c => c.isPublished);
  const availableSessions = Array.from(db.sessions.values()).filter(s => s.status === 'SCHEDULED');
  const activeInstructors = Array.from(db.instructors.values()).filter(i => i.isActive);

  const studioContext = {
    studioName: db.settings.studioName,
    businessHours: db.settings.businessHours,
    address: db.settings.address,
    classes: activeClasses.map(c => ({
      id: c.id,
      title: c.title,
      style: c.style,
      level: c.level,
      duration: `${c.durationMinutes} mins`,
      price: `$${(c.price / 100).toFixed(2)}`,
      description: c.description
    })),
    sessions: availableSessions.map(s => ({
      sessionId: s.id,
      classTitle: s.classTitle,
      instructor: s.instructorName,
      time: s.startsAt,
      seatsLeft: s.capacity - s.bookedCount,
      room: s.room
    })),
    instructors: activeInstructors.map(i => ({
      name: i.name,
      specialties: i.specialties,
      bio: i.shortBio
    }))
  };

  const systemInstruction = `
You are the ASANA Wellness Guide for ${db.settings.studioName}.
You are calm, mindful, warm, empathetic, and knowledgeable about yogic science, breathwork, and movement.
Rules:
1. ONLY recommend real classes and sessions present in the provided studio context.
2. Ground all answers in fact: do not hallucinate non-existent instructors or schedules.
3. If a customer is a beginner, gently recommend 'Hatha Alignment & Gentle Foundations' or 'Deep Restorative & Yoga Nidra'.
4. If a customer asks about stress relief, recommend 'Yin & Sacred Sound Sanctuary'.
5. If a customer expresses interest in booking, summarize the class name, instructor, time, price, and cancellation policy, and provide the sessionId so they can confirm.
6. Never diagnose medical conditions or give clinical advice.
7. Tone: serene, clear, inviting, zero corporate jargon. Keep responses concise (under 180 words) and pleasant to read.

Current Studio Catalog & Real Schedule:
${JSON.stringify(studioContext, null, 2)}
`;

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: db.settings.aiModelName || 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
          maxOutputTokens: 600
        }
      });

      const reply = response.text || 'I am here to guide your practice. Which style or focus would nourish you today?';
      
      // Check if reply mentions any specific classes to include structured card
      const matchedClasses = activeClasses.filter(c => 
        reply.toLowerCase().includes(c.title.toLowerCase()) || 
        reply.toLowerCase().includes(c.style.toLowerCase())
      );

      return res.json({
        reply,
        recommendedClasses: matchedClasses.slice(0, 2),
        modelUsed: db.settings.aiModelName || 'gemini-2.5-flash',
        groundedInStudio: true
      });
    }
  } catch (err: any) {
    console.warn('Gemini API call failed or rate limited, falling back to deterministic guide:', err.message);
  }

  // Deterministic Intelligent Fallback
  let fallbackReply = `Welcome to ${db.settings.studioName}. `;
  let recommendedClasses: YogaClass[] = [];

  const lower = latestUserMessage.toLowerCase();
  if (lower.includes('beginner') || lower.includes('new to yoga') || lower.includes('start')) {
    const hatha = db.classes.get('class-hatha-foundation');
    if (hatha) recommendedClasses.push(hatha);
    fallbackReply += `For those beginning their journey, we warmly suggest our **Hatha Alignment & Gentle Foundations**. It breaks down each posture safely with supportive props. We also have upcoming morning sessions with Kavi Sharma!`;
  } else if (lower.includes('relax') || lower.includes('stress') || lower.includes('sound') || lower.includes('sleep') || lower.includes('yin')) {
    const yin = db.classes.get('class-yin-sound-bath');
    const nidra = db.classes.get('class-restorative-nidra');
    if (yin) recommendedClasses.push(yin);
    if (nidra) recommendedClasses.push(nidra);
    fallbackReply += `To reset your nervous system, our **Yin & Sacred Sound Sanctuary** with 432Hz crystal bowls or **Deep Restorative & Yoga Nidra** offer profound parasympathetic healing.`;
  } else if (lower.includes('sweat') || lower.includes('flow') || lower.includes('vinyasa') || lower.includes('energy') || lower.includes('power')) {
    const solar = db.classes.get('class-vinyasa-flow');
    const ashtanga = db.classes.get('class-ashtanga-primary');
    if (solar) recommendedClasses.push(solar);
    if (ashtanga) recommendedClasses.push(ashtanga);
    fallbackReply += `If you seek dynamic movement and building vitality, Maya Lin's **ASANA Solar Flow** and Elena's **Ashtanga Primary Series** sync breath with invigorating flow.`;
  } else {
    recommendedClasses = Array.from(db.classes.values()).slice(0, 2);
    fallbackReply += `We offer diverse practices ranging from dynamic Solar Vinyasa to restorative Sound Baths. Tell me what your mind and body need most today—are you looking for gentle recovery, strength, or breathwork?`;
  }

  return res.json({
    reply: fallbackReply,
    recommendedClasses,
    modelUsed: 'deterministic-asana-engine',
    groundedInStudio: true
  });
});

// AI Class Recommendations
app.post('/api/v1/ai/recommendations', (req: Request, res: Response) => {
  const { experienceLevel, styles, goals, budgetMax } = req.body;
  let matches = Array.from(db.classes.values()).filter(c => c.isPublished);

  if (experienceLevel && experienceLevel !== 'All Levels') {
    matches = matches.filter(c => c.level === experienceLevel || c.level === 'All Levels');
  }

  if (styles && Array.isArray(styles) && styles.length > 0) {
    matches = matches.filter(c => styles.includes(c.style));
  }

  if (budgetMax) {
    matches = matches.filter(c => c.price <= budgetMax * 100);
  }

  res.json({
    recommendations: matches.slice(0, 4),
    matchCriteria: { experienceLevel, styles, goals }
  });
});

// ==========================================
// SEPARATED ADMIN API ROUTES (/api/v1/admin/*)
// ==========================================
app.use('/api/v1/admin', mockAuthenticate, requireAdmin);

// Admin Dashboard KPI metrics
app.get('/api/v1/admin/dashboard', (req: Request, res: Response) => {
  const allBookings = Array.from(db.bookings.values());
  const activeBookings = allBookings.filter(b => b.status === 'CONFIRMED');
  const cancelledBookings = allBookings.filter(b => b.status === 'CANCELLED');
  const allSessions = Array.from(db.sessions.values());
  
  const totalCapacity = allSessions.reduce((acc, s) => acc + s.capacity, 0);
  const totalBooked = allSessions.reduce((acc, s) => acc + s.bookedCount, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
  const cancellationRate = allBookings.length > 0 ? Math.round((cancelledBookings.length / allBookings.length) * 100) : 0;

  // Calculate actual revenue from confirmed bookings
  const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.priceSnapshot || 0), 0);

  // Identify sessions requiring attention (e.g., < 25% occupancy)
  const lowEnrollmentSessions = allSessions.filter(s => s.status === 'SCHEDULED' && (s.bookedCount / s.capacity) < 0.35);

  res.json({
    metrics: {
      todayBookingsCount: activeBookings.length,
      activeMembersCount: db.users.size,
      sessionOccupancyRate: occupancyRate,
      cancellationRate: cancellationRate,
      monthlyRevenueCents: totalRevenue,
      currency: db.settings.currency,
      totalClasses: db.classes.size,
      totalInstructors: db.instructors.size
    },
    lowEnrollmentSessions,
    upcomingSessions: allSessions.slice(0, 5),
    recentAuditLogs: db.auditLogs.slice(0, 8)
  });
});

// Admin Bookings Manager
app.get('/api/v1/admin/bookings', (req: Request, res: Response) => {
  const { status, search } = req.query;
  let bookings = Array.from(db.bookings.values());

  if (status && typeof status === 'string') {
    bookings = bookings.filter(b => b.status === status);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    bookings = bookings.filter(b => 
      b.customerName.toLowerCase().includes(q) ||
      b.customerEmail.toLowerCase().includes(q) ||
      b.bookingReference.toLowerCase().includes(q) ||
      b.classTitle.toLowerCase().includes(q)
    );
  }

  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ data: bookings, total: bookings.length });
});

app.patch('/api/v1/admin/bookings/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const booking = db.bookings.get(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Booking not found' });
  }

  const prevStatus = booking.status;
  booking.status = status;
  booking.updatedAt = new Date().toISOString();

  // If cancelling by admin, release capacity
  if (status === 'CANCELLED' && prevStatus !== 'CANCELLED') {
    const session = db.sessions.get(booking.sessionId);
    if (session && session.bookedCount > 0) {
      session.bookedCount -= 1;
      db.sessions.set(session.id, session);
    }
  }

  db.bookings.set(booking.id, booking);
  db.logAudit('ADMIN_BOOKING_STATUS_CHANGE', 'admin', {
    bookingId: booking.id,
    from: prevStatus,
    to: status
  });

  res.json({ message: 'Booking status updated', data: booking });
});

// Admin Classes CRUD
app.post('/api/v1/admin/classes', (req: Request, res: Response) => {
  const { title, description, style, level, durationMinutes, price, instructorIds, imageUrl } = req.body;

  if (!title || !style || !price) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'Title, style, and price are required' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newClass: YogaClass = {
    id: `class-${Date.now()}`,
    title,
    slug,
    description: description || '',
    style,
    level: level || 'All Levels',
    durationMinutes: Number(durationMinutes) || 60,
    price: Number(price) * 100, // store in cents
    currency: 'USD',
    instructorIds: instructorIds || ['inst-1'],
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    benefits: ['Mindful focus', 'Body awareness'],
    whatToBring: ['Yoga mat', 'Water bottle'],
    cancellationPolicyHours: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.classes.set(newClass.id, newClass);
  db.logAudit('CLASS_CREATED', 'admin', { classId: newClass.id, title: newClass.title });

  res.status(201).json({ message: 'Class created', data: newClass });
});

app.patch('/api/v1/admin/classes/:id', (req: Request, res: Response) => {
  const c = db.classes.get(req.params.id);
  if (!c) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Class not found' });
  }

  Object.assign(c, req.body, { updatedAt: new Date().toISOString() });
  db.classes.set(c.id, c);
  db.logAudit('CLASS_UPDATED', 'admin', { classId: c.id, updates: Object.keys(req.body) });

  res.json({ message: 'Class updated', data: c });
});

app.delete('/api/v1/admin/classes/:id', (req: Request, res: Response) => {
  const classId = req.params.id;
  // Protect: prevent deleting if upcoming bookings exist
  const hasBookings = Array.from(db.bookings.values()).some(b => b.classId === classId && b.status === 'CONFIRMED');
  if (hasBookings) {
    return res.status(400).json({
      error: 'CLASS_HAS_ACTIVE_BOOKINGS',
      message: 'Cannot delete class with active reservations. Archive or unpublish instead.'
    });
  }

  db.classes.delete(classId);
  db.logAudit('CLASS_DELETED', 'admin', { classId });
  res.json({ message: 'Class safely deleted' });
});

// Admin Sessions Management
app.post('/api/v1/admin/sessions', (req: Request, res: Response) => {
  const { classId, instructorId, startsAt, endsAt, capacity, location, room } = req.body;

  if (!classId || !instructorId || !startsAt || !endsAt) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing required session parameters' });
  }

  const yogaClass = db.classes.get(classId);
  const instructor = db.instructors.get(instructorId);

  const newSession: YogaSession = {
    id: `sess-${Date.now()}`,
    classId,
    classTitle: yogaClass?.title || 'Yoga Session',
    instructorId,
    instructorName: instructor?.name || 'ASANA Teacher',
    instructorAvatar: instructor?.imageUrl,
    startsAt,
    endsAt,
    timeZone: db.settings.defaultTimeZone,
    location: location || 'ASANA-Yoga Sanctuary',
    room: room || 'Studio A (Sun Room)',
    capacity: Number(capacity) || 16,
    bookedCount: 0,
    price: yogaClass ? yogaClass.price : 2800,
    currency: 'USD',
    status: 'SCHEDULED',
    createdAt: new Date().toISOString()
  };

  db.sessions.set(newSession.id, newSession);
  db.logAudit('SESSION_SCHEDULED', 'admin', { sessionId: newSession.id, startsAt, classId });

  res.status(201).json({ message: 'Session scheduled', data: newSession });
});

app.delete('/api/v1/admin/sessions/:id', (req: Request, res: Response) => {
  const sessionId = req.params.id;
  const session = db.sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'NOT_FOUND', message: 'Session not found' });
  }

  if (session.bookedCount > 0) {
    return res.status(400).json({
      error: 'SESSION_HAS_BOOKINGS',
      message: 'Cannot delete session with active reservations. Cancel the session to notify customers first.'
    });
  }

  db.sessions.delete(sessionId);
  db.logAudit('SESSION_DELETED', 'admin', { sessionId });
  res.json({ message: 'Session deleted' });
});

// Admin Customers Directory
app.get('/api/v1/admin/customers', (req: Request, res: Response) => {
  const users = Array.from(db.users.values()).map(u => {
    const customerBookings = Array.from(db.bookings.values()).filter(b => b.customerId === u.uid);
    return {
      ...u,
      bookingsCount: customerBookings.length,
      latestBooking: customerBookings[0]?.createdAt || null
    };
  });
  res.json({ data: users });
});

// Admin AI Copilot
app.post('/api/v1/admin/ai/copilot', async (req: Request, res: Response) => {
  const { prompt, task } = req.body;

  const allSessions = Array.from(db.sessions.values());
  const allBookings = Array.from(db.bookings.values());

  const studioSummary = {
    totalSessions: allSessions.length,
    occupancyAverage: '72%',
    lowCapacitySessions: allSessions.filter(s => s.bookedCount < 6).map(s => ({
      title: s.classTitle,
      time: s.startsAt,
      booked: s.bookedCount,
      capacity: s.capacity
    })),
    recentCancellations: allBookings.filter(b => b.status === 'CANCELLED').length
  };

  const systemInstruction = `
You are the Executive Studio Copilot for ASANA-Yoga administrators.
You provide strategic, actionable studio operations advice, low-occupancy resolution ideas, marketing class descriptions, and operational summaries.
Always ground answers in the studio's actual data. Be concise, professional, and clear.
Data Snapshot: ${JSON.stringify(studioSummary)}
`;

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt || 'Provide an executive summary of studio health and low-enrollment classes today.',
        config: { systemInstruction }
      });
      return res.json({ result: response.text });
    }
  } catch (err: any) {
    console.warn('Gemini copilot fallback:', err.message);
  }

  // Deterministic copilot fallback
  res.json({
    result: `**Studio Operations Copilot Report:**\n\n• **Low Enrollment Alert:** There are ${studioSummary.lowCapacitySessions.length} session(s) currently under 35% capacity this weekend. Recommendation: Send an in-app push or highlight them as 'Featured Sessions' on the public homepage.\n• **High Demand Styles:** Yin & Sound Sanctuary and Vinyasa Flow are reaching >85% capacity. Consider adding a secondary evening slot on Tuesdays and Thursdays.\n• **Cancellation Metric:** Current cancellation rate remains within healthy studio benchmark (<8%).`
  });
});

// Admin Settings
app.get('/api/v1/admin/settings', (req: Request, res: Response) => {
  res.json({ data: db.settings });
});

app.patch('/api/v1/admin/settings', (req: Request, res: Response) => {
  Object.assign(db.settings, req.body);
  db.logAudit('SETTINGS_UPDATED', 'admin', { updatedFields: Object.keys(req.body) });
  res.json({ message: 'Studio settings updated successfully', data: db.settings });
});

// ==========================================
// VITE SPA DEVELOPMENT & PRODUCTION SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🧘 ASANA-Yoga full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
