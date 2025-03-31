export interface Route {
    id: string;
    from: string;
    to: string;
    price: number;
    departureTime: string;
    arrivalTime: string;
    availableSeats: number;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  export interface Booking {
    id: string;
    userId: string;
    routeId: string;
    seatNumber: number;
    bookingDate: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }