import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, User, FileText, Star } from 'lucide-react';
import { mockAppointments } from '../../data/mockData';
import { Appointment } from '../../types';
import { format, parseISO, isAfter, startOfToday } from 'date-fns';

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAppointments = () => {
      const today = startOfToday();
      
      const upcoming = mockAppointments.filter(
        app => isAfter(parseISO(`${app.date}T${app.startTime}`), today) && app.status !== 'cancelled'
      );
      
      const past = mockAppointments.filter(
        app => !isAfter(parseISO(`${app.date}T${app.startTime}`), today) || app.status === 'cancelled'
      );
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    };
    
    fetchAppointments();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <Link
            to="/doctors"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Book New Appointment
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming ({upcomingAppointments.length})
              </button>
              <button
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('past')}
              >
                Past ({pastAppointments.length})
              </button>
            </nav>
          </div>
          
          <div className="divide-y divide-gray-200">
            {activeTab === 'upcoming' ? (
              upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start mb-4 md:mb-0">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                          {appointment.type === 'video' ? <Video size={24} /> : <User size={24} />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Dr. John Smith</h3>
                          <p className="text-blue-600">Cardiology</p>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Calendar size={16} className="mr-1" />
                            <span>{format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                            <span className="mx-2">•</span>
                            <Clock size={16} className="mr-1" />
                            <span>{appointment.startTime} - {appointment.endTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {appointment.type === 'video' && (
                          <Link
                            to={`/appointments/video/${appointment.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                          >
                            <Video size={16} className="mr-2" />
                            Join Video
                          </Link>
                        )}
                        
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          Reschedule
                        </button>
                        
                        <button className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                          Cancel
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-blue-50 rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Reason for Visit</h4>
                      <p className="text-gray-600">{appointment.reason}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">You don't have any upcoming appointments</p>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Book an Appointment
                  </Link>
                </div>
              )
            ) : (
              pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start mb-4 md:mb-0">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                          {appointment.type === 'video' ? <Video size={24} /> : <User size={24} />}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-900 mr-2">Dr. John Smith</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              appointment.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-blue-600">Cardiology</p>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Calendar size={16} className="mr-1" />
                            <span>{format(parseISO(appointment.date), 'MMMM d, yyyy')}</span>
                            <span className="mx-2">•</span>
                            <Clock size={16} className="mr-1" />
                            <span>{appointment.startTime} - {appointment.endTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {appointment.status === 'completed' && (
                          <>
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                              <FileText size={16} className="mr-2" />
                              View Prescription
                            </button>
                            
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                              <Star size={16} className="mr-2" />
                              Leave Review
                            </button>
                          </>
                        )}
                        
                        <Link
                          to={`/doctors/1`}
                          className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                        >
                          Book Again
                        </Link>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-4 bg-gray-50 rounded-md p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Doctor's Notes</h4>
                        <p className="text-gray-600">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">You don't have any past appointments</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;