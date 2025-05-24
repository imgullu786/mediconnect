import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, AlertCircle, ChevronRight, Video, CheckCircle, X, CheckSquare, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockAppointments } from '../../data/mockData';
import { Appointment } from '../../types';
import { format, parseISO, isToday, isTomorrow, startOfToday, addDays } from 'date-fns';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAppointments = () => {
      const today = startOfToday();
      
      const todayApps = mockAppointments.filter(
        app => isToday(parseISO(app.date)) && app.status !== 'cancelled'
      );
      
      const upcoming = mockAppointments.filter(
        app => !isToday(parseISO(app.date)) && isAfter(parseISO(app.date), today) && app.status !== 'cancelled'
      );
      
      setTodayAppointments(todayApps);
      setUpcomingAppointments(upcoming);
    };
    
    // Function to check if a date is after today
    const isAfter = (date: Date, today: Date) => {
      return date.getTime() > today.getTime();
    };
    
    fetchAppointments();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <div className="flex space-x-4">
            <Link
              to="/schedule"
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Manage Schedule
            </Link>
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Calendar size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Today's Appointments</h2>
                <p className="text-2xl font-semibold text-gray-900">{todayAppointments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Users size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Total Patients</h2>
                <p className="text-2xl font-semibold text-gray-900">124</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                <Clock size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Avg. Consultation Time</h2>
                <p className="text-2xl font-semibold text-gray-900">25 min</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <AlertCircle size={24} />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">Pending Tasks</h2>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next appointment */}
        {todayAppointments.length > 0 && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Next Patient</h2>
              <div className="flex flex-col md:flex-row">
                <div className="bg-blue-50 rounded-lg p-6 flex-grow mb-4 md:mb-0 md:mr-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center text-blue-600">
                      <Calendar size={20} className="mr-2" />
                      <span className="font-medium">Today</span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <Clock size={20} className="mr-2" />
                      <span className="font-medium">
                        {todayAppointments[0].startTime} - {todayAppointments[0].endTime}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Sarah Johnson</h3>
                    <p className="text-gray-600">42 years old, Female</p>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <div className="mr-4">
                      {todayAppointments[0].type === 'video' ? (
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
                      Reason: {todayAppointments[0].reason}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between space-y-4">
                  {todayAppointments[0].type === 'video' && (
                    <Link
                      to={`/appointments/video/${todayAppointments[0].id}`}
                      className="bg-green-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Video size={18} className="mr-2" />
                      Start Video Call
                    </Link>
                  )}
                  
                  <Link
                    to={`/patients/1`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    View Patient History
                  </Link>
                  
                  <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                    Add Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Today's schedule */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <Link 
                to="/schedule" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                View Calendar <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          
          <div>
            {todayAppointments.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {todayAppointments.map((appointment, index) => (
                  <li key={appointment.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {appointment.type === 'video' ? <Video size={20} /> : <User size={20} />}
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {index === 0 ? 'Sarah Johnson' : index === 1 ? 'Michael Brown' : 'Emily Wilson'}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>{appointment.startTime} - {appointment.endTime}</span>
                              <span className="mx-2">•</span>
                              <span>{appointment.reason}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-1 text-green-600 hover:text-green-800">
                              <CheckCircle size={20} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-800">
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No appointments scheduled for today</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Pending Tasks */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
          </div>
          
          <div className="p-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Review lab results for Michael Brown</p>
                  <p className="text-sm text-gray-500">Due: Today</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Write prescription for Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Due: Today</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Update treatment plan for Emily Wilson</p>
                  <p className="text-sm text-gray-500">Due: Tomorrow</p>
                </div>
              </li>
              
              <li className="pt-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  <CheckSquare size={16} className="mr-1" />
                  Add new task
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;