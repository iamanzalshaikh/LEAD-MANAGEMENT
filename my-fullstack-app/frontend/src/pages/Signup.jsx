import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { userDataContext } from '../context/userContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { serverUrl, setUser } = useContext(AuthContext);
    const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Signup request
      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password, role },
        { withCredentials: true } // Important if backend sets HTTP-only cookie
      );

      console.log('Signup successful:', response.data);
      toast.success(response.data.message || 'Signup successful!');

      // Immediately fetch current user after signup
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser); // Store user in context
      } catch (userError) {
        console.error('Error fetching current user:', userError);
      }

      navigate('/'); // Redirect to home/dashboard after signup
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Name input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                required
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </span>
            </div>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="salesman">Salesman</option>
            </select>
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>

          <p className="text-center text-gray-600 text-xs mt-4">
            Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-800">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
