export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  profile: UserProfile;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  // Patient-specific
  dob?: string;
  bloodGroup?: string;
  // Doctor-specific
  specialty?: string;
  qualifications?: string[];
  experience?: number;
  bio?: string;
  licenseNumber?: string;
  hospitalAffiliation?: string;
}

export interface Doctor extends User {
  profile: DoctorProfile;
  averageRating?: number;
  reviewCount?: number;
}

export interface DoctorProfile extends UserProfile {
  specialty: string;
  qualifications: string[];
  experience: number;
  bio: string;
  licenseNumber: string;
  hospitalAffiliation?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: 'in-person' | 'video';
  reason?: string;
  notes?: string;
  meetingLink?: string;
  payment: {
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'refunded';
  };
  createdAt: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  medications: Medication[];
  instructions?: string;
  diagnosis?: string;
  createdAt: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  uploadedById: string;
  title: string;
  fileUrl: string;
  fileType: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface DoctorSchedule {
  doctorId: string;
  workingDays: WorkingDay[];
  exceptions: ScheduleException[];
  appointmentDuration: number;
}

export interface WorkingDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface ScheduleException {
  date: string;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}