'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const guestCredentials = [
    { email: 'guestclient@gmail.com', password: 'guestclient', label: 'Guest Client' },
    { email: 'guestfreelancer@gmail.com', password: 'guestfreelancer', label: 'Guest Freelancer' },
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async (email, password) => {
    setFormData({ email, password });
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Guest login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Welcome Back to FreelanceDev!
        </h2>
        <p className="text-gray-700 text-center mb-6">
          Please login with your credentials to continue.
        </p>

        {error && (
          <div className="mb-4 text-red-700 bg-red-100 px-3 py-2 rounded text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
            required
            autoComplete="email"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mb-6">
          <h3 className="text-gray-800 font-semibold mb-2 text-center">
            Quick Guest Logins
          </h3>
          <div className="flex justify-center gap-4">
            {guestCredentials.map(({ email, password, label }) => (
              <button
                key={email}
                onClick={() => handleGuestLogin(email, password)}
                disabled={loading}
                className="bg-gray-100 text-indigo-700 rounded px-3 py-2 font-medium hover:bg-gray-200 transition"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <Link href="/req" className="hover:underline">
            Forgot password?
          </Link>
          <Link href="/register" className="hover:underline">
            New here? Register
          </Link>
        </div>
      </div>
    </div>
  );
}
