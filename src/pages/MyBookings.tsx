import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Ticket } from 'lucide-react';

interface Booking {
  id: string;
  route: {
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
  };
  seatNumber: number;
  date: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // In production, fetch actual bookings from Supabase
    const fetchBookings = async () => {
      // Example data
      setBookings([
        {
          id: '1',
          route: {
            from: 'Nairobi',
            to: 'Mombasa',
            departureTime: '08:00',
            arrivalTime: '16:00',
          },
          seatNumber: 15,
          date: '2024-03-20',
          status: 'confirmed',
        },
      ]);
    };

    fetchBookings();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
        
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Ticket className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">
                    {booking.route.from} to {booking.route.to}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}
                `}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{format(new Date(booking.date), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-medium">{booking.route.departureTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-medium">{booking.route.arrivalTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seat</p>
                  <p className="font-medium">{booking.seatNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}