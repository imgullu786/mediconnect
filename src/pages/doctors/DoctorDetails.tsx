import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, Mail, Calendar, ChevronRight, ChevronLeft, Video, Award, Briefcase } from 'lucide-react';
import { mockDoctors } from '../../data/mockData';
import { Doctor, TimeSlot } from '../../types';
import { format, parseISO, addDays } from 'date-fns';

const DoctorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDoctor = () => {
      setLoading(true);
      setTimeout(() => {
        const foundDoctor = mockDoctors.find(doc => doc.id === id);
        if (foundDoctor) {
          setDoctor(foundDoctor);
        }
        setLoading(false);
      }, 500);
    };
    
    fetchDoctor();
  }, [id]);

  // Generate some mock time slots
  useEffect(() => {
    if (doctor) {
      const slots: TimeSlot[] = [];
      for (let hour = 9; hour < 17; hour++) {
        const isAvailable = Math.random() > 0.3; // 70% chance of being available
        slots.push({
          startTime: `${hour.toString().padStart(2, '0')}:00`,
          endTime: `${hour.toString().padStart(2, '0')}:30`,
          isAvailable
        });
        
        const isNextAvailable = Math.random() > 0.3;
        slots.push({
          startTime: `${hour.toString().padStart(2, '0')}:30`,
          endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
          isAvailable: isNextAvailable
        });
      }
      setTimeSlots(slots);
    }
  }, [doctor, selectedDate]);

  const handlePrevDay = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
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
        <Link 
          to="/doctors"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Doctor Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:mr-8 mb-6 md:mb-0">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-blue-100">
                {doctor.profile.avatar ? (
                  <img
                    src={doctor.profile.avatar}
                    alt={`${doctor.profile.firstName} ${doctor.profile.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-blue-600 text-4xl font-bold">
                    {doctor.profile.firstName[0]}{doctor.profile.lastName[0]}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Dr. {doctor.profile.firstName} {doctor.profile.lastName}
              </h1>
              
              <p className="text-xl text-blue-600 mb-2">{doctor.profile.specialty}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center text-amber-500">
                  <Star size={20} fill="currentColor" />
                  <span className="ml-1 text-gray-700">
                    {doctor.averageRating} ({doctor.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin size={20} className="mr-1" />
                  <span>{doctor.profile.hospitalAffiliation}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Briefcase size={20} className="mr-1" />
                  <span>{doctor.profile.experience} years experience</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-3">
                <Link 
                  to={`/appointments/book/${doctor.id}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center font-medium"
                >
                  <Calendar size={18} className="mr-2" />
                  Book Appointment
                </Link>
                
                <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors inline-flex items-center font-medium">
                  <Video size={18} className="mr-2" />
                  Video Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b">
                <button
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'about'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('about')}
                >
                  About
                </button>
                <button
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'about' ? (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About Dr. {doctor.profile.lastName}</h2>
                    <p className="text-gray-700 mb-6">{doctor.profile.bio}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Education & Qualifications</h3>
                        <ul className="space-y-3">
                          {doctor.profile.qualifications.map((qualification, index) => (
                            <li key={index} className="flex items-start">
                              <Award size={18} className="mr-2 text-blue-600 mt-0.5" />
                              <span>{qualification}</span>
                            </li>
                          ))}
                          <li className="flex items-start">
                            <Award size={18} className="mr-2 text-blue-600 mt-0.5" />
                            <span>Medical License: {doctor.profile.licenseNumber}</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <Phone size={18} className="mr-2 text-blue-600" />
                            <span>(555) 123-4567</span>
                          </li>
                          <li className="flex items-center">
                            <Mail size={18} className="mr-2 text-blue-600" />
                            <span>{doctor.email}</span>
                          </li>
                          <li className="flex items-start">
                            <MapPin size={18} className="mr-2 text-blue-600 mt-0.5" />
                            <span>123 Medical Center Dr.<br />Suite 456<br />New York, NY 10001</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Reviews</h2>
                    <div className="flex items-center mb-6">
                      <div className="mr-4">
                        <div className="text-5xl font-bold text-gray-900">{doctor.averageRating}</div>
                        <div className="flex text-amber-400 mt-1">
                          {"★".repeat(5)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{doctor.reviewCount} reviews</div>
                      </div>
                      
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map(rating => {
                          // Generate random percentages for the rating bars
                          const percent = rating === 5 ? 70 : 
                                          rating === 4 ? 20 : 
                                          rating === 3 ? 7 : 
                                          rating === 2 ? 2 : 1;
                          
                          return (
                            <div key={rating} className="flex items-center mb-1">
                              <div className="w-8 text-sm text-gray-600">{rating}</div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-amber-400 h-2 rounded-full" 
                                  style={{ width: `${percent}%` }}
                                ></div>
                              </div>
                              <div className="w-8 text-sm text-gray-600">{percent}%</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Sample reviews */}
                    <div className="space-y-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">Patient Name</div>
                            <div className="text-gray-500 text-sm">
                              {format(addDays(new Date(), -index * 10), 'MMM d, yyyy')}
                            </div>
                          </div>
                          <div className="flex text-amber-400 mb-2">
                            {"★".repeat(5)}
                          </div>
                          <p className="text-gray-700">
                            Dr. {doctor.profile.lastName} was very thorough and took the time to explain everything to me. 
                            I felt comfortable and well taken care of during my visit. Would highly recommend!
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 text-center">
                      <button className="text-blue-600 font-medium hover:text-blue-800">
                        Load More Reviews
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book an Appointment</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevDay}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="font-medium">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </div>
                  
                  <button
                    onClick={handleNextDay}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      disabled={!slot.isAvailable}
                      className={`py-2 px-3 rounded-md text-sm font-medium ${
                        slot.isAvailable
                          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Clock size={14} className="mr-1" />
                        {slot.startTime}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Link
                    to={`/appointments/book/${doctor.id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Calendar size={18} className="mr-2" />
                    See Full Schedule
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need help?</h3>
              <p className="text-gray-700 mb-4">
                Our patient support team is available to assist you with booking or answer any questions.
              </p>
              <button className="w-full bg-white text-blue-600 border border-blue-300 py-2 px-4 rounded-md font-medium hover:bg-blue-600 hover:text-white hover:border-transparent transition-colors flex items-center justify-center">
                <Phone size={18} className="mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;