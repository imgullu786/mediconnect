import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { mockDoctors } from '../../data/mockData';
import { Doctor } from '../../types';

const specialties = [
  'All',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry'
];

const DoctorsList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  useEffect(() => {
    let results = doctors;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        doctor => 
          doctor.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.profile.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by specialty
    if (selectedSpecialty !== 'All') {
      results = results.filter(
        doctor => doctor.profile.specialty === selectedSpecialty
      );
    }
    
    setFilteredDoctors(results);
  }, [searchTerm, selectedSpecialty, doctors]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Find a Doctor</h1>
            <p className="mt-3 text-xl text-blue-100">
              Browse our network of highly qualified healthcare professionals
            </p>
          </div>
          
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  placeholder="Search by name or specialty"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                className="md:hidden bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center justify-center"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={20} className="mr-2" />
                Filters
              </button>
              
              <div className="hidden md:block">
                <select
                  className="block w-full pl-3 pr-10 py-3 border border-transparent rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Mobile filters */}
            {isFilterOpen && (
              <div className="mt-4 bg-white p-4 rounded-md shadow-md md:hidden">
                <h3 className="font-medium text-gray-900 mb-2">Specialty</h3>
                <div className="space-y-2">
                  {specialties.map((specialty) => (
                    <div key={specialty} className="flex items-center">
                      <input
                        id={`specialty-${specialty}`}
                        name="specialty"
                        type="radio"
                        checked={selectedSpecialty === specialty}
                        onChange={() => setSelectedSpecialty(specialty)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label
                        htmlFor={`specialty-${specialty}`}
                        className="ml-3 block text-sm text-gray-700"
                      >
                        {specialty}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredDoctors.length} {filteredDoctors.length === 1 ? 'Doctor' : 'Doctors'} Available
          </h2>
          <p className="mt-1 text-gray-600">
            {selectedSpecialty !== 'All' ? `Showing results for ${selectedSpecialty}` : 'Showing all specialties'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg">
              <div className="flex items-center p-6">
                <div className="h-24 w-24 rounded-full overflow-hidden mr-6 bg-blue-100 flex-shrink-0">
                  {doctor.profile.avatar ? (
                    <img
                      src={doctor.profile.avatar}
                      alt={`${doctor.profile.firstName} ${doctor.profile.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                      {doctor.profile.firstName[0]}{doctor.profile.lastName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Dr. {doctor.profile.firstName} {doctor.profile.lastName}
                  </h3>
                  <p className="text-blue-600">{doctor.profile.specialty}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex text-amber-400">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 text-sm text-gray-600">
                        {doctor.averageRating} ({doctor.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center mt-1 text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1" />
                    <span>{doctor.profile.hospitalAffiliation}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {doctor.profile.bio}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">
                    <span className="font-medium">{doctor.profile.experience}</span> years exp.
                  </div>
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;