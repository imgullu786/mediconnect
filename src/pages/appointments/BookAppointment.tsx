import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, parseISO } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Clock, Video, User, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { mockDoctors } from '../../data/mockData';
import { Doctor, TimeSlot } from '../../types';
import { generateTimeSlots } from '../../data/mockData';

// Form validation schema
const appointmentSchema = z.object({
  date: z.string().nonempty('Please select a date'),
  time: z.string().nonempty('Please select a time'),
  type: z.enum(['video', 'in-person']),
  reason: z.string().min(5, 'Please provide a reason for your visit').max(500, 'Reason is too long'),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' })
  })
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const BookAppointment = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [appointmentSummary, setAppointmentSummary] = useState<{
    date: string;
    time: string;
    type: 'video' | 'in-person';
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: 'video',
      date: format(selectedDate, 'yyyy-MM-dd'),
    }
  });
  
  const selectedTime = watch('time');
  const selectedType = watch('type');
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDoctor = () => {
      setLoading(true);
      setTimeout(() => {
        const foundDoctor = mockDoctors.find(doc => doc.id === doctorId);
        if (foundDoctor) {
          setDoctor(foundDoctor);
        }
        setLoading(false);
      }, 500);
    };
    
    fetchDoctor();
  }, [doctorId]);
  
  useEffect(() => {
    if (doctor) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setValue('date', dateStr);
      const slots = generateTimeSlots(dateStr, doctor.id);
      setAvailableSlots(slots);
    }
  }, [doctor, selectedDate, setValue]);
  
  const handlePrevDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };
  
  const handleTimeSelect = (time: string) => {
    setValue('time', time);
  };
  
  const onSubmitDateAndTime = () => {
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    
    setAppointmentSummary({
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      type: selectedType
    });
    
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };
  
  const onSubmitDetails = (data: AppointmentFormData) => {
    // In a real app, this would be an API call to create the appointment
    toast.success('Appointment booked successfully!');
    navigate('/appointments');
  };
  
  const goBack = () => {
    setCurrentStep(1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
        <p className="text-gray-600 mb-8">The doctor you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
        </div>
        
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium text-gray-600">Select Date & Time</span>
            <span className="text-sm font-medium text-gray-600">Appointment Details</span>
          </div>
        </div>
        
        {/* Doctor info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-blue-100 mr-4">
              {doctor.profile.avatar ? (
                <img
                  src={doctor.profile.avatar}
                  alt={`${doctor.profile.firstName} ${doctor.profile.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-blue-600 text-xl font-bold">
                  {doctor.profile.firstName[0]}{doctor.profile.lastName[0]}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Dr. {doctor.profile.firstName} {doctor.profile.lastName}
              </h2>
              <p className="text-blue-600">{doctor.profile.specialty}</p>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <span className="mr-3">{doctor.profile.experience} years experience</span>
                <span>Fee: $150</span>
              </div>
            </div>
          </div>
        </div>
        
        {currentStep === 1 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h2>
              
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevDay}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="font-medium text-lg">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </div>
                
                <button
                  onClick={handleNextDay}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Appointment Type</div>
                <div className="flex space-x-4">
                  <label className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    selectedType === 'video' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      value="video"
                      className="hidden"
                      {...register('type')}
                    />
                    <Video size={20} className="mr-2" />
                    <span>Video Consultation</span>
                  </label>
                  
                  <label className={`flex items-center p-3 border rounded-md cursor-pointer ${
                    selectedType === 'in-person' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      value="in-person"
                      className="hidden"
                      {...register('type')}
                    />
                    <User size={20} className="mr-2" />
                    <span>In-Person Visit</span>
                  </label>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Available Time Slots</div>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      disabled={!slot.isAvailable}
                      className={`py-3 px-4 rounded-md text-sm font-medium ${
                        !slot.isAvailable
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTime === slot.startTime
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                      onClick={() => slot.isAvailable && handleTimeSelect(slot.startTime)}
                    >
                      <div className="flex items-center justify-center">
                        <Clock size={14} className="mr-1" />
                        {slot.startTime}
                      </div>
                    </button>
                  ))}
                </div>
                
                {availableSlots.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No available slots for this date</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={onSubmitDateAndTime}
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
              
              <div className="bg-blue-50 rounded-md p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center text-blue-700">
                    <Calendar size={18} className="mr-2" />
                    <span className="font-medium">
                      {appointmentSummary?.date && format(parseISO(appointmentSummary.date), 'EEEE, MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center text-blue-700">
                    <Clock size={18} className="mr-2" />
                    <span className="font-medium">{appointmentSummary?.time}</span>
                  </div>
                </div>
                <div className="flex items-center text-blue-700">
                  {appointmentSummary?.type === 'video' ? (
                    <>
                      <Video size={18} className="mr-2" />
                      <span>Video Consultation</span>
                    </>
                  ) : (
                    <>
                      <User size={18} className="mr-2" />
                      <span>In-Person Visit</span>
                    </>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-6">
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Visit
                  </label>
                  <textarea
                    id="reason"
                    className={`block w-full rounded-md shadow-sm px-3 py-2 border ${
                      errors.reason ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    rows={3}
                    placeholder="Please describe your symptoms or reason for consultation"
                    {...register('reason')}
                  ></textarea>
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    className="block w-full rounded-md shadow-sm px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    rows={2}
                    placeholder="Any additional information you'd like to share with the doctor"
                    {...register('notes')}
                  ></textarea>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
                  
                  <div className="bg-gray-50 rounded-md p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-medium">$150.00</span>
                    </div>
                    {appointmentSummary?.type === 'video' && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="font-medium">$5.00</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold">${appointmentSummary?.type === 'video' ? '155.00' : '150.00'}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center text-gray-700 mb-4">
                      <CreditCard size={20} className="mr-2" />
                      <span>Payment will be processed after booking confirmation</span>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="agreeToTerms"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          {...register('agreeToTerms')}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreeToTerms" className="text-gray-700">
                          I agree to the{' '}
                          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Terms and Conditions
                          </a>
                          {' '}and{' '}
                          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                            Privacy Policy
                          </a>
                        </label>
                        {errors.agreeToTerms && (
                          <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={goBack}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;