import { Doctor, Appointment, TimeSlot } from '../types';
import { addDays, format, parseISO, addMinutes } from 'date-fns';

// Generate doctors data
export const mockDoctors: Doctor[] = [
  {
    id: '1',
    email: 'dr.smith@example.com',
    role: 'doctor',
    profile: {
      firstName: 'John',
      lastName: 'Smith',
      specialty: 'Cardiology',
      qualifications: ['MD', 'PhD', 'FACC'],
      experience: 15,
      bio: 'Dr. Smith is a board-certified cardiologist with over 15 years of experience. He specializes in preventive cardiology and heart disease management.',
      licenseNumber: 'MED123456',
      hospitalAffiliation: 'Central Medical Center',
      avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg'
    },
    averageRating: 4.8,
    reviewCount: 124
  },
  {
    id: '2',
    email: 'dr.johnson@example.com',
    role: 'doctor',
    profile: {
      firstName: 'Emily',
      lastName: 'Johnson',
      specialty: 'Dermatology',
      qualifications: ['MD', 'FAAD'],
      experience: 12,
      bio: 'Dr. Johnson is a dermatologist who specializes in both medical and cosmetic dermatology. She has a particular interest in skin cancer prevention and treatment.',
      licenseNumber: 'MED789012',
      hospitalAffiliation: 'University Hospital',
      avatar: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg'
    },
    averageRating: 4.9,
    reviewCount: 98
  },
  {
    id: '3',
    email: 'dr.patel@example.com',
    role: 'doctor',
    profile: {
      firstName: 'Raj',
      lastName: 'Patel',
      specialty: 'Neurology',
      qualifications: ['MD', 'PhD'],
      experience: 20,
      bio: 'Dr. Patel is a neurologist with expertise in treating headaches, epilepsy, and movement disorders. He has conducted extensive research in the field of neurodegenerative diseases.',
      licenseNumber: 'MED345678',
      hospitalAffiliation: 'Neuroscience Institute',
      avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg'
    },
    averageRating: 4.7,
    reviewCount: 156
  },
  {
    id: '4',
    email: 'dr.rodriguez@example.com',
    role: 'doctor',
    profile: {
      firstName: 'Maria',
      lastName: 'Rodriguez',
      specialty: 'Pediatrics',
      qualifications: ['MD', 'FAAP'],
      experience: 10,
      bio: 'Dr. Rodriguez is a compassionate pediatrician dedicated to providing comprehensive care for children from birth through adolescence. She has a special interest in childhood development and nutrition.',
      licenseNumber: 'MED901234',
      hospitalAffiliation: 'Children\'s Medical Center',
      avatar: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg'
    },
    averageRating: 4.9,
    reviewCount: 210
  },
  {
    id: '5',
    email: 'dr.chen@example.com',
    role: 'doctor',
    profile: {
      firstName: 'David',
      lastName: 'Chen',
      specialty: 'Orthopedics',
      qualifications: ['MD', 'FAAOS'],
      experience: 18,
      bio: 'Dr. Chen is an orthopedic surgeon specializing in sports medicine and joint replacement. He has worked with professional athletes and has pioneered minimally invasive surgical techniques.',
      licenseNumber: 'MED567890',
      hospitalAffiliation: 'Sports Medicine Institute',
      avatar: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg'
    },
    averageRating: 4.6,
    reviewCount: 178
  },
  {
    id: '6',
    email: 'dr.wilson@example.com',
    role: 'doctor',
    profile: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      specialty: 'Psychiatry',
      qualifications: ['MD', 'PhD'],
      experience: 14,
      bio: 'Dr. Wilson is a psychiatrist who specializes in anxiety disorders, depression, and PTSD. She takes a holistic approach to mental health, integrating medication management with psychotherapy.',
      licenseNumber: 'MED234567',
      hospitalAffiliation: 'Behavioral Health Center',
      avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg'
    },
    averageRating: 4.8,
    reviewCount: 145
  }
];

// Generate appointments data
const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
const dayAfterTomorrowStr = format(addDays(today, 2), 'yyyy-MM-dd');

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '123',
    doctorId: '1',
    date: todayStr,
    startTime: '09:00',
    endTime: '09:30',
    status: 'scheduled',
    type: 'video',
    reason: 'Annual checkup',
    payment: {
      amount: 150,
      currency: 'USD',
      status: 'paid'
    },
    createdAt: '2023-06-01T10:00:00Z'
  },
  {
    id: '2',
    patientId: '123',
    doctorId: '2',
    date: tomorrowStr,
    startTime: '14:00',
    endTime: '14:30',
    status: 'scheduled',
    type: 'in-person',
    reason: 'Skin rash consultation',
    payment: {
      amount: 200,
      currency: 'USD',
      status: 'pending'
    },
    createdAt: '2023-06-02T10:00:00Z'
  },
  {
    id: '3',
    patientId: '123',
    doctorId: '3',
    date: dayAfterTomorrowStr,
    startTime: '11:00',
    endTime: '11:30',
    status: 'scheduled',
    type: 'video',
    reason: 'Headache follow-up',
    payment: {
      amount: 180,
      currency: 'USD',
      status: 'paid'
    },
    createdAt: '2023-06-03T10:00:00Z'
  },
  {
    id: '4',
    patientId: '123',
    doctorId: '1',
    date: '2023-05-15',
    startTime: '10:00',
    endTime: '10:30',
    status: 'completed',
    type: 'video',
    reason: 'Blood pressure check',
    notes: 'Patient\'s blood pressure is normal. Continue with current medication.',
    payment: {
      amount: 150,
      currency: 'USD',
      status: 'paid'
    },
    createdAt: '2023-05-10T10:00:00Z'
  },
  {
    id: '5',
    patientId: '123',
    doctorId: '4',
    date: '2023-05-20',
    startTime: '15:00',
    endTime: '15:30',
    status: 'cancelled',
    type: 'in-person',
    reason: 'Child vaccination',
    payment: {
      amount: 100,
      currency: 'USD',
      status: 'refunded'
    },
    createdAt: '2023-05-18T10:00:00Z'
  }
];

// Generate available time slots
export const generateTimeSlots = (date: string, doctorId: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM
  const interval = 30; // 30 minutes
  
  // Simulating some slots being already booked
  const bookedTimes = mockAppointments
    .filter(app => app.doctorId === doctorId && app.date === date && app.status !== 'cancelled')
    .map(app => app.startTime);
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const hourStr = hour.toString().padStart(2, '0');
      const minuteStr = minute.toString().padStart(2, '0');
      const startTime = `${hourStr}:${minuteStr}`;
      
      // Calculate end time
      const startDate = parseISO(`${date}T${startTime}`);
      const endDate = addMinutes(startDate, interval);
      const endTime = format(endDate, 'HH:mm');
      
      // Check if the slot is available
      const isAvailable = !bookedTimes.includes(startTime);
      
      slots.push({
        startTime,
        endTime,
        isAvailable
      });
    }
  }
  
  return slots;
};