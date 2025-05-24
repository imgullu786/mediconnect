/*
  # Initial Schema Setup for Medical Consultation Platform

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text)
      - `profile` (jsonb)
      - `created_at` (timestamp)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references users)
      - `doctor_id` (uuid, references users)
      - `date` (date)
      - `start_time` (time)
      - `end_time` (time)
      - `status` (text)
      - `type` (text)
      - `reason` (text)
      - `notes` (text)
      - `payment_status` (text)
      - `created_at` (timestamp)
    
    - `prescriptions`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, references appointments)
      - `doctor_id` (uuid, references users)
      - `patient_id` (uuid, references users)
      - `medications` (jsonb)
      - `instructions` (text)
      - `diagnosis` (text)
      - `created_at` (timestamp)
    
    - `medical_records`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references users)
      - `uploaded_by` (uuid, references users)
      - `title` (text)
      - `file_url` (text)
      - `file_type` (text)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `reviews`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references users)
      - `doctor_id` (uuid, references users)
      - `appointment_id` (uuid, references appointments)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  profile jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Appointments table
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) NOT NULL,
  doctor_id uuid REFERENCES users(id) NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  type text NOT NULL CHECK (type IN ('video', 'in-person')),
  reason text,
  notes text,
  payment_status text NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

-- Prescriptions table
CREATE TABLE prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) NOT NULL,
  doctor_id uuid REFERENCES users(id) NOT NULL,
  patient_id uuid REFERENCES users(id) NOT NULL,
  medications jsonb NOT NULL DEFAULT '[]',
  instructions text,
  diagnosis text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Doctors can create prescriptions"
  ON prescriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = doctor_id);

-- Medical records table
CREATE TABLE medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) NOT NULL,
  uploaded_by uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own medical records"
  ON medical_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = uploaded_by);

CREATE POLICY "Users can create medical records"
  ON medical_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES users(id) NOT NULL,
  doctor_id uuid REFERENCES users(id) NOT NULL,
  appointment_id uuid REFERENCES appointments(id) NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Patients can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

-- Indexes for better query performance
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_reviews_doctor_id ON reviews(doctor_id);