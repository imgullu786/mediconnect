import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, FileText, ChevronRight, User, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockAppointments } from '../../data/mockData';
import { Appointment } from '../../types';
import { format, parseISO, isAfter, isBefore, startOfToday } from 'date-fns';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [showNotification, setShowNotification] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAppointments = () => {
      const today = startOfToday();
      
      const upcoming = mockAppointments.filter(
        app => isAfter(parseISO(`${app.date}T${app.startTime}`), today) && app.status !== 'cancelled'
      );
      
      const past = mockAppointments.filter(
        app => isBefore(parseISO(`${app.date}T${app.startTime}`), today) || app.status === 'cancelled'
      );
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    };
    
    fetchAppointments();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <Link
            to="/doctors"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Find a Doctor
          </Link>
        </div>
        
        {/* Notification */}
        {showNotification && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Complete your profile to get personalized recommendations and faster booking.
                </p>
                <div className="mt-3 text-sm md:mt-0 md:ml-6 flex items-center">
                  <Link to="/profile" className="text-blue-700 font-medium hover:text-blue-600">
                    Complete now
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                  <button 
                    onClick={() => setShowNotification(false)}
                    className="ml-4 text-gray-400 hover:text-gray-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Calendar size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Upcoming Appointments</h2>
                <p className="text-2xl font-semibold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Completed Consultations</h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {pastAppointments.filter(app => app.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FileText size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Medical Records</h2>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next appointment */}
        {upcomingAppointments.length > 0 && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Next Appointment</h2>
              <div className="flex flex-col md:flex-row">
                <div className="bg-blue-50 rounded-lg p-6 flex-grow mb-4 md:mb-0 md:mr-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center text-blue-600">
                      <Calendar size={20} className="mr-2" />
                      <span className="font-medium">
                        {format(parseISO(upcomingAppointments[0].date), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <Clock size={20} className="mr-2" />
                      <span className="font-medium">
                        {upcomingAppointments[0].startTime} - {upcomingAppointments[0].endTime}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Dr. John Smith</h3>
                    <p className="text-gray-600">Cardiology</p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="mr-4">
                      {upcomingAppointments[0].type === 'video' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Video size={14} className="mr-1" />
                          Video Consultation
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <User size={14} className="mr-1" />
                          In-Person Visit
                        </span>
                      )}
                    </div>
                    <div>
                      Reason: {upcomingAppointments[0].reason}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between space-y-4">
                  {upcomingAppointments[0].type === 'video' && (
                    <Link
                      to={`/appointments/video/${upcomingAppointments[0].id}`}
                      className="bg-green-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Video size={18} className="mr-2" />
                      Join Video Call
                    </Link>
                  )}
                  
                  <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                    Reschedule
                  </button>
                  
                  <button className="bg-white border border-red-300 text-red-600 px-6 py-3 rounded-md text-sm font-medium hover:bg-red-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Upcoming appointments */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              <Link 
                to="/appointments" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          
          <div>
            {upcomingAppointments.length > 0 ? (
              <ul>
                {upcomingAppointments.slice(1).map((appointment, index) => (
                  <li key={appointment.id} className={index !== upcomingAppointments.length - 2 ? 'border-b border-gray-200' : ''}>
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            {appointment.type === 'video' ? <Video size={20} /> : <User size={20} />}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Dr. Emily Johnson</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            <span>
                              {format(parseISO(appointment.date), 'MMM d, yyyy')} • {appointment.startTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/appointments/${appointment.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No upcoming appointments</p>
                <Link
                  to="/doctors"
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Book an appointment
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Medical Records */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Medical Records</h2>
              <Link 
                to="/medical-records" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            <ul className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <li key={index} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {index === 0 ? 'Blood Test Results' : index === 1 ? 'Chest X-Ray' : 'Prescription'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {format(addDays(new Date(), -index * 10), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Download
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;