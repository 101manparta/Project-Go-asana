# ASANA-Yoga: Architecture & Production Deployment Specification

## 1. System Overview
ASANA-Yoga is a modern yoga and wellness studio platform built with a high-integrity dual-stack design:
- **Client Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion with black-and-white minimalist aesthetics.
- **API Runtime & Gateway:** Full-stack Express server (`server.ts`) hosting versioned `/api/v1` routes with ASANA Wellness Guide server-side proxying and Vite dev middleware.
- **Go Micro-Monolith Backend:** Standalone Go 1.25+ Gin service in `/backend` with clean architecture, Firestore repository interfaces, concurrency transaction mutexes, and unit test suites.
- **Database & Auth:** Google Cloud Firestore and Firebase Authentication with strict Security Rules.

---

## 2. Absolute Admin Separation
As mandated by security standards:
- **Route Isolation:** All administrative workflows live strictly under `/admin/*` (`/admin/dashboard`, `/admin/bookings`, `/admin/classes`, `/admin/schedule`, `/admin/customers`, `/admin/copilot`, etc.).
- **Public Zero-Leakage:** The public website layout (`Navbar`, `Footer`, `Home`, etc.) never renders admin links, buttons, or indicators.
- **Server-Side Authorization:** Non-admin callers visiting `/api/v1/admin/*` receive an immediate `HTTP 403 Forbidden`. The system enforces `RoleAdmin` or `RoleSuperAdmin` through Firebase ID tokens or cryptographic claims—browser-provided client claims are never trusted blindly.

---

## 3. Booking Engine Integrity & Concurrency Safety
1. **Capacity Enforcement:** Session capacity (14–18 mats) is validated atomically on the backend. Frontends cannot modify `bookedCount`.
2. **Idempotency Keys:** Every booking submission generates a unique idempotency key (`idemp-<sessionId>-<uid>-<timestamp>`), preventing double charges and duplicate mat reservations under erratic networks.
3. **Duplicate Prevention:** The backend verifies that the same customer cannot hold multiple confirmed reservations for the identical session.
4. **Cancellation Policy:** Standard sessions require cancellation 4+ hours prior to start time. Late cancellations are rejected by the backend to prevent revenue loss.
5. **Capacity Release:** Valid cancellations atomically release session capacity and credit balances back to the customer profile.

---

## 4. AI Yoga Assistant Architecture
- **Provider Abstraction:** The server proxies queries to `@google/genai` using model `gemini-2.5-flash` with fallback to deterministic grounded responses.
- **Database Grounding:** System instructions inject the live catalog of published classes, instructors, and scheduled sessions. Hallucinated classes or schedules are strictly disallowed.
- **AI Safety & Ethics:** The assistant acts as a mindful movement and scheduling guide. It never diagnoses clinical ailments or prescribes medical cures.
- **Explicit Booking Confirmation:** The assistant presents structured session options and asks the user for explicit confirmation before calling the booking mutation.

---

## 5. Production Deployment Strategy
### A. Frontend
- Built using `npm run build` into `/dist`.
- Deployed to **Firebase Hosting** or **Vercel** with global CDN caching.

### B. Go Backend
- Built using `backend/Dockerfile` into an Alpine container image.
- Deployed to **Google Cloud Run** (Scale-to-zero free tier: 2 million requests/month free).
- Set environment variables:
  ```env
  PORT=8080
  GIN_MODE=release
  FIREBASE_PROJECT_ID=your-project-id
  GEMINI_API_KEY=your-gemini-key
  CORS_ALLOW_ORIGINS=https://asana-yoga.studio
  ```

### C. Cloud Firestore
- Free tier includes 50,000 reads, 20,000 writes, and 20,000 deletes daily.
- Security rules deployed via `firebase deploy --only firestore:rules`.
