import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SeatSelector from '../components/SeatSelector';
import MpesaPayment from '../components/MpesaPayment';
import { toast } from 'react-hot-toast';

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);

  // ✅ All major bus routes in Kenya
  const routes = [
    { from: 'Nairobi', to: 'Mombasa', price: 2000, departureTime: '08:00', arrivalTime: '16:00' },
    { from: 'Mombasa', to: 'Kisumu', price: 3500, departureTime: '07:00', arrivalTime: '19:00' },
    { from: 'Kisumu', to: 'Eldoret', price: 800, departureTime: '09:30', arrivalTime: '12:00' },
    { from: 'Eldoret', to: 'Nakuru', price: 900, departureTime: '08:00', arrivalTime: '11:30' },
    { from: 'Nakuru', to: 'Nairobi', price: 800, departureTime: '07:00', arrivalTime: '09:30' },
    { from: 'Garissa', to: 'Nairobi', price: 2500, departureTime: '05:00', arrivalTime: '15:00' },
    { from: 'Kisii', to: 'Nairobi', price: 1400, departureTime: '06:00', arrivalTime: '12:00' },
    { from: 'Machakos', to: 'Nairobi', price: 500, departureTime: '10:00', arrivalTime: '11:30' },
    { from: 'Nyeri', to: 'Nairobi', price: 700, departureTime: '08:00', arrivalTime: '10:30' },
    { from: 'Wajir', to: 'Nairobi', price: 3500, departureTime: '04:00', arrivalTime: '20:00' },
    { from: 'Kitale', to: 'Eldoret', price: 500, departureTime: '09:00', arrivalTime: '10:30' },
    { from: 'Lodwar', to: 'Kitale', price: 1800, departureTime: '06:00', arrivalTime: '12:00' },
    { from: 'Malindi', to: 'Mombasa', price: 700, departureTime: '10:00', arrivalTime: '12:30' },
    { from: 'Busia', to: 'Kisumu', price: 600, departureTime: '08:00', arrivalTime: '09:30' },
    { from: 'Isiolo', to: 'Nairobi', price: 1500, departureTime: '07:00', arrivalTime: '13:00' },
    { from: 'Taveta', to: 'Voi', price: 600, departureTime: '08:30', arrivalTime: '10:00' },
    { from: 'Nanyuki', to: 'Nairobi', price: 1000, departureTime: '09:00', arrivalTime: '12:00' },
    { from: 'Narok', to: 'Nairobi', price: 900, departureTime: '09:30', arrivalTime: '12:30' },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchBookedSeats = async () => {
      const selectedRoute = routes[selectedRouteIndex];
      const today = format(new Date(), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('bookings')
        .select('seat_number')
        .eq('route_from', selectedRoute.from)
        .eq('route_to', selectedRoute.to)
        .eq('date', today);

      if (error) {
        console.error('Error fetching booked seats:', error);
        return;
      }

      setBookedSeats(data?.map(booking => booking.seat_number) || []);
    };

    fetchBookedSeats();
  }, [user, selectedRouteIndex, navigate]);

  const selectedRoute = {
    ...routes[selectedRouteIndex],
    date: format(new Date(), 'yyyy-MM-dd'),
  };

  const handlePaymentComplete = () => {
    toast.success('Booking confirmed!');
    navigate('/bookings');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Booking Details</h2>

          <label className="block text-gray-600 mb-2">Select Your Route</label>
          <select
            value={selectedRouteIndex}
            onChange={(e) => setSelectedRouteIndex(parseInt(e.target.value))}
            className="w-full p-2 border rounded-md mb-4"
          >
            {routes.map((route, index) => (
              <option key={index} value={index}>
                {route.from} → {route.to} (KES {route.price})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-semibold">{selectedRoute.from}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-semibold">{selectedRoute.to}</p>
            </div>
            <div>
              <p className="text-gray-600">Departure</p>
              <p className="font-semibold">{selectedRoute.departureTime}</p>
            </div>
            <div>
              <p className="text-gray-600">Arrival</p>
              <p className="font-semibold">{selectedRoute.arrivalTime}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-semibold">{selectedRoute.date}</p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-semibold">KES {selectedRoute.price}</p>
            </div>
          </div>

          {!showPayment ? (
            <>
              <SeatSelector
                totalSeats={44}
                selectedSeat={selectedSeat}
                onSeatSelect={setSelectedSeat}
                bookedSeats={bookedSeats}
              />
              <button
                onClick={() => setShowPayment(true)}
                disabled={!selectedSeat}
                className={`mt-6 w-full py-2 px-4 rounded-md text-white font-medium
                  ${selectedSeat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
                `}
              >
                Continue to Payment
              </button>
            </>
          ) : (
            <MpesaPayment
              amount={selectedRoute.price}
              onPaymentComplete={handlePaymentComplete}
              bookingDetails={{
                routeFrom: selectedRoute.from,
                routeTo: selectedRoute.to,
                seatNumber: selectedSeat!,
                date: selectedRoute.date,
                departureTime: selectedRoute.departureTime,
                arrivalTime: selectedRoute.arrivalTime,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}