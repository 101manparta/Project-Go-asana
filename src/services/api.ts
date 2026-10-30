import { 
  YogaClass, 
  YogaSession, 
  Instructor, 
  Booking, 
  MembershipPlan, 
  StudioSettings, 
  UserProfile, 
  AIRecommendationRequest 
} from '../types';

const API_BASE = '/api/v1';

class ApiService {
  private currentRole: string = 'CUSTOMER';
  private currentUserUid: string = '';
  private currentUserEmail: string = '';
  private currentUserName: string = '';
  private currentToken: string = '';

  setAuthHeaders(role: string, uid: string, email: string = '', displayName: string = '', token: string = '') {
    this.currentRole = role;
    this.currentUserUid = uid;
    this.currentUserEmail = email;
    this.currentUserName = displayName;
    this.currentToken = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      'X-User-Role': this.currentRole,
      'X-User-UID': this.currentUserUid,
      'X-User-Email': this.currentUserEmail,
      'X-User-Name': this.currentUserName,
      ...(this.currentToken ? { Authorization: `Bearer ${this.currentToken}` } : 
         (this.currentRole === 'ADMIN' || this.currentRole === 'SUPER_ADMIN' 
          ? { Authorization: 'Bearer demo-admin-token' } 
          : {})),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch {
        errorData = { message: res.statusText };
      }
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Auth sync with backend
  async syncUser(userData: { uid: string; email: string; displayName?: string; photoUrl?: string }) {
    return this.request<{ data: UserProfile }>('/auth/sync', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Health
  async getHealth() {
    return this.request<{ status: string; geminiConfigured: boolean }>('/health');
  }

  // Classes
  async getClasses(params?: { style?: string; level?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.style) query.append('style', params.style);
    if (params?.level) query.append('level', params.level);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    return this.request<{ data: YogaClass[]; total: number }>(`/classes${qs ? `?${qs}` : ''}`);
  }

  async getClassById(id: string) {
    return this.request<{ data: YogaClass & { upcomingSessions: YogaSession[] } }>(`/classes/${id}`);
  }

  // Instructors
  async getInstructors() {
    return this.request<{ data: Instructor[]; total: number }>('/instructors');
  }

  async getInstructorById(id: string) {
    return this.request<{ data: Instructor & { sessions: YogaSession[] } }>(`/instructors/${id}`);
  }

  // Sessions
  async getSessions(params?: { date?: string; style?: string; instructorId?: string }) {
    const query = new URLSearchParams();
    if (params?.date) query.append('date', params.date);
    if (params?.style) query.append('style', params.style);
    if (params?.instructorId) query.append('instructorId', params.instructorId);
    const qs = query.toString();
    return this.request<{ data: YogaSession[]; total: number }>(`/sessions${qs ? `?${qs}` : ''}`);
  }

  async getSessionById(id: string) {
    return this.request<{ data: YogaSession & { class: YogaClass; instructor: Instructor } }>(`/sessions/${id}`);
  }

  // Pricing
  async getPricing() {
    return this.request<{ data: MembershipPlan[] }>('/pricing');
  }

  // Bookings (Transactional)
  async createBooking(sessionId: string, idempotencyKey?: string) {
    return this.request<{ message: string; data: Booking; sessionSeatsLeft: number }>('/bookings', {
      method: 'POST',
      body: JSON.stringify({ sessionId, idempotencyKey }),
    });
  }

  async getMyBookings() {
    return this.request<{ data: Booking[] }>('/me/bookings');
  }

  async cancelBooking(bookingId: string) {
    return this.request<{ message: string; data: Booking }>(`/me/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
  }

  // User Profile
  async getMyProfile() {
    return this.request<{ data: UserProfile }>('/me/profile');
  }

  async updateProfile(updates: Partial<UserProfile>) {
    return this.request<{ message: string; data: UserProfile }>('/me/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // AI Assistant
  async sendAiChat(messages: Array<{ role: 'user' | 'assistant'; content: string }>, userPreferences?: any) {
    return this.request<{
      reply: string;
      recommendedClasses: YogaClass[];
      modelUsed: string;
      groundedInStudio: boolean;
    }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, userPreferences }),
    });
  }

  async getAiRecommendations(criteria: AIRecommendationRequest) {
    return this.request<{ recommendations: YogaClass[]; matchCriteria: any }>('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify(criteria),
    });
  }

  // Admin Endpoints
  async getAdminDashboard() {
    return this.request<{
      metrics: any;
      lowEnrollmentSessions: YogaSession[];
      upcomingSessions: YogaSession[];
      recentAuditLogs: any[];
    }>('/admin/dashboard');
  }

  async getAdminBookings(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    return this.request<{ data: Booking[]; total: number }>(`/admin/bookings${qs ? `?${qs}` : ''}`);
  }

  async updateAdminBookingStatus(id: string, status: string) {
    return this.request<{ message: string; data: Booking }>(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async createAdminClass(classData: Partial<YogaClass>) {
    return this.request<{ message: string; data: YogaClass }>('/admin/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  }

  async updateAdminClass(id: string, updates: Partial<YogaClass>) {
    return this.request<{ message: string; data: YogaClass }>(`/admin/classes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteAdminClass(id: string) {
    return this.request<{ message: string }>(`/admin/classes/${id}`, {
      method: 'DELETE',
    });
  }

  async createAdminSession(sessionData: any) {
    return this.request<{ message: string; data: YogaSession }>('/admin/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteAdminSession(id: string) {
    return this.request<{ message: string }>(`/admin/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminCustomers() {
    return this.request<{ data: any[] }>('/admin/customers');
  }

  async askAdminCopilot(prompt: string) {
    return this.request<{ result: string }>('/admin/ai/copilot', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  }

  async getAdminSettings() {
    return this.request<{ data: StudioSettings }>('/admin/settings');
  }

  async updateAdminSettings(settings: Partial<StudioSettings>) {
    return this.request<{ message: string; data: StudioSettings }>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  }
}

export const api = new ApiService();
