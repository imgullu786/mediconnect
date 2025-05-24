import { Link } from 'react-router-dom';
import { Search, Calendar, Video, FileText, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Healthcare at Your Fingertips
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Connect with trusted doctors online for consultations, prescriptions, and follow-ups.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/doctors"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg inline-flex items-center"
                >
                  Find a Doctor
                  <ChevronRight size={20} className="ml-2" />
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                >
                  Sign Up Now
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg" 
                alt="Doctor with patient"
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How MediConnect Works</h2>
            <p className="mt-4 text-xl text-gray-600">Simple steps to get the care you need</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find a Doctor</h3>
              <p className="text-gray-600">Browse specialists and read patient reviews to find the right doctor.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Appointment</h3>
              <p className="text-gray-600">Select a convenient time slot and schedule your appointment.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Video Consultation</h3>
              <p className="text-gray-600">Connect with your doctor through our secure video platform.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Care</h3>
              <p className="text-gray-600">Receive prescriptions, treatment plans and follow-up care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Specialties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Specialty</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map((specialty, index) => (
              <Link 
                key={index} 
                to={`/doctors?specialty=${specialty.name}`}
                className="bg-white hover:bg-blue-50 border border-gray-200 rounded-lg p-6 text-center transition-colors"
              >
                <div className="text-blue-600 mb-3">
                  {specialty.icon}
                </div>
                <h3 className="font-medium text-gray-900">{specialty.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Patient Testimonials</h2>
            <p className="mt-4 text-xl text-gray-600">What our patients are saying</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    {testimonial.initial}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <div className="flex text-amber-400">
                      {"★".repeat(5)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to take control of your health?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of patients who have simplified their healthcare journey with MediConnect.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-lg"
            >
              Create Account
            </Link>
            <Link
              to="/doctors"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Mock data
const specialties = [
  { name: "Cardiology", icon: <span className="text-2xl">❤️</span> },
  { name: "Dermatology", icon: <span className="text-2xl">🧬</span> },
  { name: "Orthopedics", icon: <span className="text-2xl">🦴</span> },
  { name: "Pediatrics", icon: <span className="text-2xl">👶</span> },
  { name: "Neurology", icon: <span className="text-2xl">🧠</span> },
  { name: "Ophthalmology", icon: <span className="text-2xl">👁️</span> },
  { name: "Psychiatry", icon: <span className="text-2xl">🧘</span> },
  { name: "Gynecology", icon: <span className="text-2xl">👩</span> }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    initial: "S",
    text: "MediConnect made it so easy to find a specialist and get an appointment. The video consultation was seamless and I got the care I needed without leaving home."
  },
  {
    name: "Robert Garcia",
    initial: "R",
    text: "I was skeptical about telemedicine, but my experience was excellent. The doctor was attentive and my prescription was ready right after the consultation."
  },
  {
    name: "Emily Williams",
    initial: "E",
    text: "As a busy mom, being able to consult with a pediatrician at 9 PM when my child had a fever was invaluable. This service is a game-changer for parents."
  }
];

export default Home;