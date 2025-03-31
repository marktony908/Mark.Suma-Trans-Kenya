import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SeatSelector from '../components/SeatSelector';
import MpesaPayment from '../components/MpesaPayment';

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Example route data - in production, this would come from your route selection
  const route = {
    from: 'Nairobi',
    to: 'Mombasa',
    price: 2000,
    departureTime: '08:00',
    arrivalTime: '16:00',
    date: format(new Date(), 'yyyy-MM-dd'),
  };

  const handlePaymentComplete = () => {
    // In production, this would create a booking record in your database
    navigate('/bookings');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-semibold">{route.from}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-semibold">{route.to}</p>
            </div>
            <div>
              <p className="text-gray-600">Departure</p>
              <p className="font-semibold">{route.departureTime}</p>
            </div>
            <div>
              <p className="text-gray-600">Arrival</p>
              <p className="font-semibold">{route.arrivalTime}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-semibold">{route.date}</p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-semibold">KES {route.price}</p>
            </div>
          </div>

          {!showPayment ? (
            <>
              <SeatSelector
                totalSeats={44}
                selectedSeat={selectedSeat}
                onSeatSelect={setSelectedSeat}
                bookedSeats={[1, 4, 7, 12, 15, 20]} // Example booked seats
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
              amount={route.price}
              onPaymentComplete={handlePaymentComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}