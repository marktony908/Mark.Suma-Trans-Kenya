/*
  # Initial Schema Setup for Mark.Suma Trans-Kenya

  1. New Tables
    - `routes`
      - `id` (uuid, primary key)
      - `from` (text)
      - `to` (text)
      - `price` (integer)
      - `departure_time` (time)
      - `arrival_time` (time)
      - `available_seats` (integer)
      - `created_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `route_id` (uuid, references routes)
      - `seat_number` (integer)
      - `booking_date` (date)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "from" text NOT NULL,
  "to" text NOT NULL,
  price integer NOT NULL,
  departure_time time NOT NULL,
  arrival_time time NOT NULL,
  available_seats integer NOT NULL DEFAULT 44,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_price CHECK (price > 0),
  CONSTRAINT valid_seats CHECK (available_seats >= 0)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  route_id uuid REFERENCES routes NOT NULL,
  seat_number integer NOT NULL,
  booking_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_seat_number CHECK (seat_number > 0 AND seat_number <= 44),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for routes
CREATE POLICY "Routes are viewable by everyone"
  ON routes FOR SELECT
  TO public
  USING (true);

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert some initial routes
INSERT INTO routes ("from", "to", price, departure_time, arrival_time)
VALUES
  ('Nairobi', 'Mombasa', 2000, '08:00', '16:00'),
  ('Nairobi', 'Kisumu', 1500, '09:00', '15:00'),
  ('Mombasa', 'Malindi', 800, '10:00', '12:00');