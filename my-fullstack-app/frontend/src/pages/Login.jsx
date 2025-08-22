import axios from 'axios';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userDataContext } from '../context/userContext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { serverUrl, login } = useContext(AuthContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${serverUrl}/api/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true
      });

      console.log('Login successful:', response.data);
      toast.success(response.data.message || 'Login successful!');

      if (login) {
        login(response.data.user);
      }

      if (getCurrentUser) {
        await getCurrentUser();
      }

      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.data.user.role === 'salesman') {
        navigate('/sales/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Login'
            )}
          </button>

          <p className="text-center text-gray-600 text-xs mt-4">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-800">Sign Up</Link>
          </p>

          {/* ✅ Added Test Accounts Info */}
          <p className="text-center text-gray-600 text-sm mt-6">
            <span className="font-semibold">Test Accounts (password: 12345678) admin@gmailcom  </span>
            <br />
            admin@gmailcom 
            <br />
            salesmen1@gmail.com
            <br />
            salesmen2@gmail.com
            <br />
            salesmen3@gmail.com
            <br />
            salesmen4@gmail.com
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

