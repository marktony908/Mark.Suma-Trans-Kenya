import { Link } from 'react-router-dom';
import { Bus, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="h-8 w-8" />
            <span className="text-xl font-bold">Mark.Suma Trans-Kenya</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/booking" className="hover:text-blue-200">Book Now</Link>
            <Link to="/bookings" className="hover:text-blue-200">My Bookings</Link>
            <Link to="/auth" className="flex items-center space-x-1 hover:text-blue-200">
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}