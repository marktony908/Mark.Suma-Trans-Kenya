import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Auth from '../pages/Auth';
import BookingPage from '../pages/BookingPage';
import MyBookings from '../pages/MyBookings';
import { Bus, MapPin, Clock, CreditCard } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Toaster position="top-right" />
          
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                
                {/* Features Section */}
                <div className="max-w-7xl mx-auto py-16 px-4">
                  <h2 className="text-3xl font-bold text-center mb-12">Why Choose Mark.Suma Trans-Kenya?</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Bus className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Modern Fleet</h3>
                      <p className="text-gray-600">Comfortable and well-maintained vehicles for your journey</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Wide Coverage</h3>
                      <p className="text-gray-600">Serving all major routes across Kenya</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Punctual Service</h3>
                      <p className="text-gray-600">Reliable departure and arrival times</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Easy Payment</h3>
                      <p className="text-gray-600">Convenient M-Pesa payment integration</p>
                    </div>
                  </div>
                </div>
                
                {/* Popular Routes Section */}
                <div className="bg-white py-16">
                  <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Popular Routes</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        {
                          from: 'Nairobi',
                          to: 'Mombasa',
                          price: 2000,
                          time: '8 hours',
                          image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                        },
                        {
                          from: 'Nairobi',
                          to: 'Kisumu',
                          price: 1500,
                          time: '6 hours',
                          image: 'https://images.unsplash.com/photo-1594750852563-5ed8a0af8c9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                        },
                        {
                          from: 'Mombasa',
                          to: 'Malindi',
                          price: 800,
                          time: '2 hours',
                          image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                        }
                      ].map((route, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <img src={route.image} alt={`${route.from} to ${route.to}`} className="w-full h-48 object-cover" />
                          <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">{route.from} to {route.to}</h3>
                            <div className="flex justify-between items-center text-gray-600">
                              <span>KES {route.price}</span>
                              <span>{route.time}</span>
                            </div>
                            <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Routes>
          
          {/* Footer */}
          <footer className="bg-blue-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                  <p>Phone: +254 700 000 000</p>
                  <p>Email: info@marksumatrans.co.ke</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:text-blue-200">About Us</a></li>
                    <li><a href="#" className="hover:text-blue-200">Terms & Conditions</a></li>
                    <li><a href="#" className="hover:text-blue-200">Privacy Policy</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Popular Routes</h4>
                  <ul className="space-y-2">
                    <li>Nairobi - Mombasa</li>
                    <li>Nairobi - Kisumu</li>
                    <li>Mombasa - Malindi</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="hover:text-blue-200">Facebook</a>
                    <a href="#" className="hover:text-blue-200">Twitter</a>
                    <a href="#" className="hover:text-blue-200">Instagram</a>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-blue-800 text-center">
                <p>&copy; 2025 Mark.Suma Trans-Kenya. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;