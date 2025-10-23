// Supabase API integration for FindMyEvent platform - Fixed to use native client
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseClient';
import { showToast } from './toast';

// Global type declarations for window notification systems
declare global {
  interface Window {
    organizerVerificationNotifications?: Array<{
      id: string;
      type: 'organizer_verification';
      userId: string;
      userName?: string;
      userEmail?: string;
      college?: string;
      submittedAt: string;
      status: 'pending' | 'approved' | 'rejected';
      resolvedAt?: string;
      adminViewed: boolean;
    }>;
    userNotifications?: Record<string, Array<{
      id: string;
      userId: string;
      type: string;
      title: string;
      message: string;
      status?: string;
      createdAt: string;
      read: boolean;
    }>>;
  }
}

// Types
export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'fest' | 'hackathon' | 'workshop' | 'cultural' | 'sports' | 'tech';
  date: string;
  time: string;
  venue: string;
  college: string;
  organizer: string;
  organizerId: string;
  price: number;
  capacity: number;
  registered: number;
  status: 'draft' | 'upcoming' | 'live' | 'ended';
  image: string;
  tags: string[];
  requirements?: string[];
  prizes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'organizer' | 'crew' | 'admin';
  college?: string;
  phone?: string;
  avatar?: string;
  interests?: string[];
  location?: string;
  verified: boolean;
  isOnboarded?: boolean;
  year?: string;
  // Organizer verification fields
  verificationStatus?: 'unverified' | 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  // Personal
  dateOfBirth?: string;
  profilePhotoUrl?: string;
  // College
  collegeAddress?: string;
  departmentOrCourse?: string;
  // Club/Organization
  clubName?: string;
  clubPosition?: string;
  clubCategory?: 'Tech' | 'Cultural' | 'Sports' | 'Other';
  // Documents (URLs)
  docStudentIdUrl?: string;
  docClubCertificateUrl?: string;
  // Bank/Payments
  bankAccountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  ticketId?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  registrationId: string;
  qrCode: string;
  status: 'valid' | 'used' | 'cancelled';
  generatedAt: string;
  usedAt?: string;
}

// Mock data for development - will be replaced with real DB operations later
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'TechFest 2024',
    description: 'Annual technology festival featuring workshops, hackathons, and competitions.',
    type: 'tech',
    date: '2024-03-15',
    time: '09:00',
    venue: 'Main Auditorium',
    college: 'IIT Delhi',
    organizer: 'Tech Club',
    organizerId: 'org-1',
    price: 500,
    capacity: 200,
    registered: 45,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    tags: ['technology', 'hackathon', 'workshops'],
    requirements: ['Laptop', 'Basic programming knowledge'],
    prizes: ['₹50,000 for winner', '₹25,000 for runner-up'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'Cultural Night 2024',
    description: 'A vibrant evening of music, dance, and cultural performances.',
    type: 'cultural',
    date: '2024-03-20',
    time: '18:00',
    venue: 'Open Air Theatre',
    college: 'Delhi University',
    organizer: 'Cultural Society',
    organizerId: 'org-2',
    price: 200,
    capacity: 500,
    registered: 156,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    tags: ['cultural', 'music', 'dance'],
    requirements: ['None'],
    prizes: ['Certificates for participants'],
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '3',
    title: 'AI/ML Workshop',
    description: 'Hands-on workshop on Artificial Intelligence and Machine Learning fundamentals.',
    type: 'workshop',
    date: '2024-03-25',
    time: '10:00',
    venue: 'Computer Lab 1',
    college: 'IIIT Hyderabad',
    organizer: 'AI Club',
    organizerId: 'org-3',
    price: 300,
    capacity: 50,
    registered: 32,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    tags: ['AI', 'ML', 'workshop', 'hands-on'],
    requirements: ['Basic Python knowledge', 'Laptop with Python installed'],
    prizes: ['Certificate of completion'],
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z'
  },
  {
    id: '4',
    title: 'CodeClash Hackathon',
    description: '48-hour coding marathon to build innovative solutions using latest technologies.',
    type: 'hackathon',
    date: '2024-04-05',
    time: '08:00',
    venue: 'Innovation Center',
    college: 'NIT Trichy',
    organizer: 'Coding Club',
    organizerId: 'org-4',
    price: 0,
    capacity: 100,
    registered: 67,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800',
    tags: ['hackathon', 'coding', 'innovation', 'tech'],
    requirements: ['Laptop', 'Programming experience', 'Team of 2-4 members'],
    prizes: ['₹1,00,000 for winner', '₹50,000 for runner-up', '₹25,000 for third place'],
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  },
  {
    id: '5',
    title: 'Cricket Championship 2024',
    description: 'Inter-college cricket tournament with teams from across the state.',
    type: 'sports',
    date: '2024-04-10',
    time: '06:00',
    venue: 'Sports Complex',
    college: 'Mumbai University',
    organizer: 'Sports Committee',
    organizerId: 'org-5',
    price: 100,
    capacity: 300,
    registered: 89,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
    tags: ['sports', 'cricket', 'tournament', 'competition'],
    requirements: ['Sports gear', 'Team registration'],
    prizes: ['Trophy and ₹30,000', 'Runner-up ₹15,000'],
    createdAt: '2024-01-19T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  },
  {
    id: '6',
    title: 'Art & Literature Fest',
    description: 'Celebration of arts, literature, poetry, and creative expression.',
    type: 'cultural',
    date: '2024-04-15',
    time: '14:00',
    venue: 'Central Library',
    college: 'Jadavpur University',
    organizer: 'Literary Society',
    organizerId: 'org-6',
    price: 150,
    capacity: 200,
    registered: 134,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    tags: ['art', 'literature', 'poetry', 'cultural'],
    requirements: ['None'],
    prizes: ['Recognition certificates', 'Publication opportunities'],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '7',
    title: 'Blockchain Workshop',
    description: 'Comprehensive workshop on blockchain technology and cryptocurrency.',
    type: 'workshop',
    date: '2024-04-20',
    time: '10:00',
    venue: 'Tech Auditorium',
    college: 'IIT Bombay',
    organizer: 'Blockchain Club',
    organizerId: 'org-7',
    price: 400,
    capacity: 80,
    registered: 45,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    tags: ['blockchain', 'cryptocurrency', 'technology', 'workshop'],
    requirements: ['Basic programming knowledge', 'Laptop'],
    prizes: ['Certificate and course materials'],
    createdAt: '2024-01-21T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z'
  },
  {
    id: '8',
    title: 'Annual College Fest',
    description: 'Grand celebration with multiple events, competitions, and performances.',
    type: 'fest',
    date: '2024-04-25',
    time: '09:00',
    venue: 'Entire Campus',
    college: 'Delhi College of Engineering',
    organizer: 'Student Council',
    organizerId: 'org-8',
    price: 250,
    capacity: 1000,
    registered: 423,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    tags: ['fest', 'celebration', 'events', 'competitions'],
    requirements: ['College ID', 'Event-specific requirements'],
    prizes: ['Multiple prizes across events'],
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z'
  }
];

const mockUsers: User[] = [
  {
    id: 'a47c6ca1-718d-48de-8313-f310fef2761f',
    name: 'John Doe',
    email: 'john@example.com',
    type: 'student',
    college: 'IIT Delhi',
    verified: true,
    isOnboarded: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // Add mock verified organizers
  {
    id: 'org-1',
    name: 'Tech Club Lead',
    email: 'tech@iitdelhi.ac.in',
    type: 'organizer',
    college: 'IIT Delhi',
    verified: true,
    isOnboarded: true,
    verificationStatus: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'org-2',
    name: 'Cultural Society Head',
    email: 'cultural@du.ac.in',
    type: 'organizer',
    college: 'Delhi University',
    verified: true,
    isOnboarded: true,
    verificationStatus: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'org-3',
    name: 'AI Club Coordinator',
    email: 'ai@iiith.ac.in',
    type: 'organizer',
    college: 'IIIT Hyderabad',
    verified: true,
    isOnboarded: true,
    verificationStatus: 'approved',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Base API class - now using native Supabase client instead of Edge Functions
class SupabaseAPI {

  // Auth methods - these use native Supabase auth
  async signup(email: string, password: string, name: string, type: string): Promise<User> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, type },
        },
      });

      if (error) throw error;

      const authUser = data.user;
      const session = data.session;

      // Create profile using mock data for now
      if (authUser) {
        const newProfile: User = {
          id: authUser.id,
          name: name || authUser.user_metadata?.name || 'User',
          email: authUser.email || email,
          type: (type as any) || 'student',
          verified: !!authUser.email_confirmed_at,
          isOnboarded: false,
          // Set initial verification status for organizers
          verificationStatus: type === 'organizer' ? 'unverified' : undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // For now, add to mock data (later this will be a real DB insert)
        mockUsers.push(newProfile);

        showToast.auth.signupSuccess();
        return newProfile;
      }

      // If sign-up requires email confirmation and no session, return minimal user placeholder
      showToast.success('Account created. Please verify your email to continue.');
      return {
        id: 'pending',
        name,
        email,
        type: (type as any),
        verified: false,
        isOnboarded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User;
    } catch (error: any) {
      console.error('Signup error:', error);
      showToast.auth.signupError();
      throw error;
    }
  }

  // OAuth methods
  async signInWithGoogle(): Promise<{ user: User; session: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        showToast.auth.loginError();
        throw new Error(error.message);
      }

      showToast.success('Redirecting to Google...');
      return data as any;
    } catch (error) {
      console.error('Google OAuth error:', error);
      showToast.auth.loginError();
      throw error;
    }
  }

  async signInWithGitHub(): Promise<{ user: User; session: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('GitHub OAuth error:', error);
        showToast.auth.loginError();
        throw new Error(error.message);
      }

      showToast.success('Redirecting to GitHub...');
      return data as any;
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      showToast.auth.loginError();
      throw error;
    }
  }

  async signInWithPhone(phone: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) {
        console.error('Phone OTP error:', error);
        showToast.error('Failed to send OTP');
        throw new Error(error.message);
      }

      showToast.success('OTP sent successfully!');
      return { data, error: null };
    } catch (error) {
      console.error('Phone OTP error:', error);
      showToast.error('Failed to send OTP');
      throw error;
    }
  }

  async verifyPhoneOtp(phone: string, token: string): Promise<{ user: User; session: any }> {
    try {
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms'
      });

      if (error) {
        console.error('Phone OTP verification error:', error);
        showToast.auth.loginError();
        throw new Error(error.message);
      }

      if (!session) {
        throw new Error('No session returned after OTP verification');
      }

      // Get or create user profile from mock data (later from real DB)
      let user = mockUsers.find(u => u.id === session.user.id);
      if (!user) {
        user = {
          id: session.user.id,
          name: session.user.phone || 'User',
          email: session.user.email || '',
          phone: session.user.phone || '',
          type: 'student',
          verified: true,
          isOnboarded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockUsers.push(user);
      }

      showToast.auth.loginSuccess(user.name);
      return { user, session };
    } catch (error) {
      console.error('Phone OTP verification error:', error);
      showToast.auth.loginError();
      throw error;
    }
  }

  async signInWithSupabase(email: string, password: string): Promise<{ user: User; session: any }> {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign-in error:', error);
        showToast.auth.loginError();
        throw new Error(error.message);
      }

      if (!session) {
        throw new Error('No session returned');
      }

      // Get user profile from mock data (later from real DB)
      let user = mockUsers.find(u => u.id === session.user.id);
      if (!user) {
        user = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          type: 'student',
          verified: !!session.user.email_confirmed_at,
          isOnboarded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockUsers.push(user);
      }
      
      showToast.auth.loginSuccess(user.name);
      return { user, session };
    } catch (error) {
      console.error('Authentication error during sign-in:', error);
      showToast.auth.loginError();
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast.auth.logoutSuccess();
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  async getCurrentSession(): Promise<{ user: User; session: any } | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return null;
      }

      // Get user profile from mock data (later from real DB)
      let user = mockUsers.find(u => u.id === session.user.id);
      if (!user) {
        const authUser = session.user;
        const meta: any = authUser.user_metadata || {};
        user = {
          id: authUser.id,
          name: meta.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          type: (meta.type as any) || 'student',
          verified: !!authUser.email_confirmed_at,
          isOnboarded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockUsers.push(user);
      }

      return { user, session };
    } catch (error) {
      console.error('Error getting current session:', error);
      return null;
    }
  }

  // Events API - using mock data with strict verification-based filtering
  async getEvents(filters?: { type?: string; college?: string; search?: string }, userId?: string): Promise<Event[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));

      let filteredEvents: Event[] = [];

      // Determine which events to show based on user verification status
      if (userId) {
        const user = mockUsers.find(u => u.id === userId);

        if (user?.type === 'organizer') {
          // For organizers, strict verification requirements
          if (user.verificationStatus === 'approved') {
            // Only approved organizers see real events
            filteredEvents = [...mockEvents];
            console.log('Showing real events for approved organizer');
          } else {
            // Unverified/pending/rejected organizers see NO events
            filteredEvents = [];
            console.log('No events shown for unverified organizer:', user.verificationStatus || 'unverified');
          }
        } else {
          // Students and other user types see all real events
          filteredEvents = [...mockEvents];
        }
      } else {
        // No user ID - show all real events (public view)
        // Filter out events created by unverified organizers
        filteredEvents = mockEvents.filter(event => {
          // Find the organizer who created this event
          const organizer = mockUsers.find(u => u.id === event.organizerId);
          // Only show events from verified organizers or non-organizer accounts
          return !organizer || organizer.type !== 'organizer' || organizer.verificationStatus === 'approved';
        });
        console.log('Public view: showing only events from verified organizers');
      }

      // Apply filters
      if (filters?.type) {
        filteredEvents = filteredEvents.filter(event => event.type === filters.type);
      }

      if (filters?.college) {
        filteredEvents = filteredEvents.filter(event =>
          event.college.toLowerCase().includes(filters.college!.toLowerCase())
        );
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      return filteredEvents;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async getEvent(id: string): Promise<Event> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      // First, try to find the exact event
      let event = mockEvents.find(e => e.id === id);

      // If not found, try some fallback logic for common cases
      if (!event) {
        console.warn(`Event with ID '${id}' not found, checking fallbacks...`);

        // If someone tries to access with a number-like ID, ensure it's a string
        const stringId = String(id);
        event = mockEvents.find(e => e.id === stringId);

        // If still not found and it's a valid looking ID, log details for debugging
        if (!event) {
          console.error(`Event lookup failed for ID: '${id}' (type: ${typeof id})`);
          console.log('Available event IDs:', mockEvents.map(e => e.id));

          // For development/demo purposes, return the first event if the ID looks like a test ID
          if (id && (id.includes('test') || id.includes('demo') || id.includes('sample') || id.length > 10)) {
            console.log('Returning first available event as fallback for demo/test ID');
            return mockEvents[0];
          }

          throw new Error(`Event with ID '${id}' not found`);
        }
      }

      return event;
    } catch (error) {
      console.error('Error fetching event:', error);
      // Don't show toast here - let the component handle the error display
      throw error;
    }
  }

  async createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registered'>, creatorUserId?: string): Promise<Event> {
    try {
      // Check if creator is a verified organizer
      const creator = creatorUserId ? mockUsers.find(u => u.id === creatorUserId) : null;

      if (creator?.type === 'organizer' && creator.verificationStatus !== 'approved') {
        throw new Error('Only verified organizers can create events. Please complete verification first.');
      }

      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        registered: 0,
        // Ensure organizerId is set to the creator if they're an organizer
        organizerId: creator?.type === 'organizer' ? creator.id : eventData.organizerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockEvents.push(newEvent);

      // Different success message based on creator verification status
      if (creator?.type === 'organizer' && creator.verificationStatus === 'approved') {
        showToast.events.createSuccess(newEvent.title + ' - Event will be visible on homepage immediately');
      } else {
        showToast.events.createSuccess(newEvent.title);
      }

      console.log('Event created:', {
        title: newEvent.title,
        createdBy: creator?.name || 'Unknown',
        organizerVerified: creator?.verificationStatus === 'approved',
        willShowOnHomepage: !creator || creator.type !== 'organizer' || creator.verificationStatus === 'approved'
      });

      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      if (error.message?.includes('verified organizers')) {
        showToast.error('Event creation failed: Complete organizer verification first');
      } else {
        showToast.events.createError();
      }
      throw error;
    }
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    try {
      const eventIndex = mockEvents.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }
      
      mockEvents[eventIndex] = {
        ...mockEvents[eventIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      showToast.events.updateSuccess();
      return mockEvents[eventIndex];
    } catch (error) {
      console.error('Error updating event:', error);
      showToast.events.updateError();
      throw error;
    }
  }

  // Users API - using mock data
  async getUser(id: string): Promise<User> {
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      showToast.error('Failed to fetch user profile');
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      showToast.profile.updateSuccess();
      return mockUsers[userIndex];
    } catch (error) {
      console.error('Error updating user:', error);
      showToast.profile.updateError();
      throw error;
    }
  }

  // Organizer Verification - using mock data with admin notification
  async submitOrganizerVerification(userId: string, payload: Partial<User>): Promise<void> {
    try {
      // Update user with pending status and verification details
      await this.updateUser(userId, {
        verificationStatus: 'pending',
        rejectionReason: undefined,
        ...payload,
      });

      // Create admin notification entry
      const notification = {
        id: `notification-${Date.now()}`,
        type: 'organizer_verification',
        userId,
        userName: payload.name,
        userEmail: mockUsers.find(u => u.id === userId)?.email,
        college: payload.college,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        adminViewed: false
      };

      // Store notification for admin (in real app, this would trigger email/push notification)
      if (!window.organizerVerificationNotifications) {
        window.organizerVerificationNotifications = [];
      }
      window.organizerVerificationNotifications.push(notification);

      // Dispatch event for real-time admin dashboard updates
      window.dispatchEvent(new CustomEvent('newOrganizerVerification', {
        detail: notification
      }));

      console.log('Admin notification created for organizer verification:', notification);
      showToast.success('Verification submitted! Admin will review your details within 24-48 hours.');
    } catch (error) {
      console.error('Error submitting verification:', error);
      showToast.error('Failed to submit verification details');
      throw error;
    }
  }

  async getPendingOrganizerVerifications(): Promise<Array<{ id: string; userId: string; name: string | null; email: string | null; college: string | null; submittedAt: string; documents: string[]; clubName?: string; department?: string }>> {
    const pendingUsers = mockUsers.filter(u => u.verificationStatus === 'pending');
    return pendingUsers.map(u => ({
      id: `verification-${u.id}`,
      userId: u.id,
      name: u.name,
      email: u.email,
      college: u.college || null,
      clubName: u.clubName || undefined,
      department: u.departmentOrCourse || undefined,
      submittedAt: u.updatedAt,
      documents: [
        u.docStudentIdUrl,
        u.docClubCertificateUrl,
        u.profilePhotoUrl
      ].filter(Boolean)
    }));
  }

  async reviewOrganizerVerification(userId: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<void> {
    try {
      // Update user verification status
      await this.updateUser(userId, {
        verificationStatus: status,
        rejectionReason,
      });

      // Get user details for notification
      const user = mockUsers.find(u => u.id === userId);

      // Create user notification
      const userNotification = {
        id: `user-notification-${Date.now()}`,
        userId,
        type: 'verification_result',
        title: `Organizer Verification ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: status === 'approved'
          ? 'Congratulations! Your organizer account has been approved. You can now access all events and create your own.'
          : `Your organizer verification was rejected. Reason: ${rejectionReason || 'Please contact support for details.'}`,
        status,
        createdAt: new Date().toISOString(),
        read: false
      };

      // Store user notification (in real app, would send email/push notification)
      if (!window.userNotifications) {
        window.userNotifications = {};
      }
      if (!window.userNotifications[userId]) {
        window.userNotifications[userId] = [];
      }
      window.userNotifications[userId].push(userNotification);

      // Mark admin notification as resolved
      if (window.organizerVerificationNotifications) {
        const notificationIndex = window.organizerVerificationNotifications.findIndex(
          n => n.userId === userId && n.status === 'pending'
        );
        if (notificationIndex !== -1) {
          window.organizerVerificationNotifications[notificationIndex].status = status;
          window.organizerVerificationNotifications[notificationIndex].resolvedAt = new Date().toISOString();
        }
      }

      // Dispatch events for real-time updates
      window.dispatchEvent(new CustomEvent('verificationStatusChanged', {
        detail: { userId, status, user }
      }));

      window.dispatchEvent(new CustomEvent('userNotification', {
        detail: { userId, notification: userNotification }
      }));

      if (status === 'approved') {
        showToast.success(`${user?.name || 'Organizer'} verification approved successfully! They now have access to all events.`);
      } else {
        showToast.success(`${user?.name || 'Organizer'} verification rejected.`);
      }

      console.log(`Organizer verification ${status}:`, { userId, userName: user?.name, rejectionReason });
    } catch (error) {
      console.error('Error reviewing verification:', error);
      showToast.error(`Failed to ${status} verification`);
      throw error;
    }
  }

  async setOrganizerVerification(
    userId: string,
    status: 'pending' | 'approved' | 'rejected',
    rejectionReason?: string
  ): Promise<User> {
    if (status === 'pending') {
      await this.updateUser(userId, { verificationStatus: status, rejectionReason });
      return this.getUser(userId);
    }
    await this.reviewOrganizerVerification(userId, status as 'approved' | 'rejected', rejectionReason);
    return this.getUser(userId);
  }

  // Storage helpers - placeholder
  async uploadVerificationFile(file: File, userId: string, kind: string): Promise<string> {
    // For now, return a placeholder URL
    return `https://placeholder.com/verification/${userId}/${kind}`;
  }

  // Registrations API - mock implementations
  async registerForEvent(userId: string, eventId: string, formData?: any, teamRegistrationType?: string, teamMembers?: any[]): Promise<Registration> {
    try {
      const registration: Registration = {
        id: `reg-${Date.now()}`,
        userId,
        eventId,
        status: 'confirmed',
        paymentStatus: 'completed',
        registeredAt: new Date().toISOString(),
        checkedIn: false,
      };

      // Update event registered count
      const eventIndex = mockEvents.findIndex(e => e.id === eventId);
      if (eventIndex !== -1) {
        mockEvents[eventIndex].registered += 1;
      }

      showToast.events.registrationSuccess('event');
      return registration;
    } catch (error) {
      console.error('Error registering for event:', error);
      showToast.events.registrationError();
      throw error;
    }
  }

  async getUserRegistrations(userId: string): Promise<(Registration & { event: Event })[]> {
    try {
      // Return empty array for now
      return [];
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      showToast.error('Failed to fetch registrations');
      throw error;
    }
  }

  // Tickets API - mock implementations
  async generateTicket(registrationId: string): Promise<Ticket> {
    try {
      const ticket: Ticket = {
        id: `ticket-${Date.now()}`,
        eventId: 'mock-event',
        userId: 'mock-user',
        registrationId,
        qrCode: `qr-${Date.now()}`,
        status: 'valid',
        generatedAt: new Date().toISOString(),
      };
      
      showToast.tickets.generateSuccess();
      return ticket;
    } catch (error) {
      console.error('Error generating ticket:', error);
      showToast.tickets.generateError();
      throw error;
    }
  }

  async verifyTicket(qrCode: string): Promise<{ valid: boolean; ticket?: Ticket; event?: Event; user?: User }> {
    try {
      // Mock verification
      return { valid: true };
    } catch (error) {
      console.error('Error verifying ticket:', error);
      showToast.error('Failed to verify ticket');
      throw error;
    }
  }

  async checkInTicket(qrCode: string): Promise<boolean> {
    try {
      showToast.crew.checkinSuccess('attendee');
      return true;
    } catch (error) {
      console.error('Error checking in ticket:', error);
      showToast.crew.checkinError();
      throw error;
    }
  }

  // Notification methods
  async getUserNotifications(userId: string): Promise<Array<{
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    status?: string;
    createdAt: string;
    read: boolean;
  }>> {
    if (!window.userNotifications || !window.userNotifications[userId]) {
      return [];
    }
    return window.userNotifications[userId].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    if (window.userNotifications?.[userId]) {
      const notification = window.userNotifications[userId].find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
    }
  }

  async getAdminNotifications(): Promise<Array<{
    id: string;
    type: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    college?: string;
    submittedAt: string;
    status: string;
    adminViewed: boolean;
  }>> {
    return window.organizerVerificationNotifications || [];
  }

  async markAdminNotificationViewed(notificationId: string): Promise<void> {
    if (window.organizerVerificationNotifications) {
      const notification = window.organizerVerificationNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.adminViewed = true;
      }
    }
  }

  // Helper method to check if user can see real events
  canUserSeeRealEvents(user: User): boolean {
    if (!user) return false;

    // Students and other non-organizer users can always see real events
    if (user.type !== 'organizer') return true;

    // Organizers can only see real events if they are approved
    return user.verificationStatus === 'approved';
  }

  // Helper to get verification status display
  getVerificationStatusDisplay(status?: string): { text: string; color: string; description: string } {
    switch (status) {
      case 'approved':
        return {
          text: 'Verified',
          color: 'text-green-600',
          description: 'Your organizer account is verified. You have access to all features.'
        };
      case 'pending':
        return {
          text: 'Pending Review',
          color: 'text-yellow-600',
          description: 'Your verification is under review. You\'ll be notified within 24-48 hours.'
        };
      case 'rejected':
        return {
          text: 'Verification Rejected',
          color: 'text-red-600',
          description: 'Your verification was rejected. Please contact support or resubmit with correct details.'
        };
      default:
        return {
          text: 'Not Verified',
          color: 'text-gray-600',
          description: 'Complete your organizer verification to access all events and features.'
        };
    }
  }
}

// Export singleton instance
export const supabaseApi = new SupabaseAPI();

// Real-time data hooks
import React from 'react';

export function useRealTimeEvents(userId?: string) {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [usingFallback, setUsingFallback] = React.useState(false);

  const fetchEvents = React.useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const data = await supabaseApi.getEvents(undefined, userId);
      setEvents(data);
      setUsingFallback(false);
    } catch (error) {
      console.error('Error in useRealTimeEvents:', error);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    fetchEvents();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents, usingFallback };
}

export function useRealTimeUserRegistrations(userId: string | null) {
  const [registrations, setRegistrations] = React.useState<(Registration & { event: Event })[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRegistrations = React.useCallback(async () => {
    if (!userId) {
      setRegistrations([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await supabaseApi.getUserRegistrations(userId);
      setRegistrations(data);
    } catch (error) {
      console.error('Error in useRealTimeUserRegistrations:', error);
      // Use empty array as fallback - user hasn't registered for events yet
      setRegistrations([]);
      setError(null); // Don't show error for missing registrations
    } finally {
      setLoading(false);
    }
  }, [userId]);

  React.useEffect(() => {
    fetchRegistrations();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(fetchRegistrations, 30000);
    return () => clearInterval(interval);
  }, [fetchRegistrations]);

  return { registrations, loading, error, refetch: fetchRegistrations };
}
