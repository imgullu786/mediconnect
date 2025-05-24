import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import DoctorsList from './pages/doctors/DoctorsList';
import DoctorDetails from './pages/doctors/DoctorDetails';
import BookAppointment from './pages/appointments/BookAppointment';
import MyAppointments from './pages/appointments/MyAppointments';
import VideoConsultation from './pages/appointments/VideoConsultation';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="doctors" element={<DoctorsList />} />
            <Route path="doctors/:id" element={<DoctorDetails />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard/patient" element={<PatientDashboard />} />
              <Route path="dashboard/doctor" element={<DoctorDashboard />} />
              <Route path="appointments/book/:doctorId" element={<BookAppointment />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="appointments/video/:appointmentId" element={<VideoConsultation />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;