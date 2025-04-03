import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaIdCard } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function Auth() {
  const navigate = useNavigate();
  const { signUp, signIn, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // State for login & signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        const userDetails = { id, name, gender, phone };
        await signUp(email, password, userDetails);
        toast.success('Account created! Please sign in.');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">

            {/* Name input */}
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="name" className="sr-only">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-3 py-2 pl-10 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full Name"
                  />
                </div>
              </div>
            )}

            {/* ID input */}
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="id" className="sr-only">ID</label>
                <div className="relative">
                  <FaIdCard className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" />
                  <input
                    id="id"
                    type="text"
                    required
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="block w-full px-3 py-2 pl-10 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ID"
                  />
                </div>
              </div>
            )}

            {/* Gender selection */}
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="gender" className="sr-only">Gender</label>
                <select
                  id="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            )}

            {/* Phone input */}
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="phone" className="sr-only">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full px-3 py-2 pl-10 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            )}

            {/* Email input */}
            <div className="mb-3">
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email Address"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mb-3">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <FaLock className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 pl-10 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Password"
                />
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          </div>
        </form>

        {/* Toggle between login and signup */}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
