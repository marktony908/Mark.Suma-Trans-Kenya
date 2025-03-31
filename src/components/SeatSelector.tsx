
interface SeatSelectorProps {
  totalSeats: number;
  selectedSeat: number | null;
  onSeatSelect: (seatNumber: number) => void;
  bookedSeats: number[];
}

export default function SeatSelector({ totalSeats, selectedSeat, onSeatSelect, bookedSeats }: SeatSelectorProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Select Your Seat</h3>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seatNumber) => (
          <button
            key={seatNumber}
            onClick={() => onSeatSelect(seatNumber)}
            disabled={bookedSeats.includes(seatNumber)}
            className={`
              p-2 rounded-md text-center
              ${selectedSeat === seatNumber ? 'bg-blue-600 text-white' : ''}
              ${bookedSeats.includes(seatNumber) ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-blue-100'}
              ${!bookedSeats.includes(seatNumber) && !selectedSeat ? 'bg-white border border-gray-300' : ''}
            `}
          >
            {seatNumber}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm"></div>
          <span className="ml-2 text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
          <span className="ml-2 text-sm">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
          <span className="ml-2 text-sm">Booked</span>
        </div>
      </div>
    </div>
  );
}