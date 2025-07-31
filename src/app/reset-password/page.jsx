'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/auth/verify-otp', formData);
      alert('Password reset successful! Please login with your new password.');
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 via-cyan-500 to-teal-600 flex flex-col items-center justify-center px-4 py-8">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
          Reset Your Password
        </h2>
        <p className="text-white/90 text-center mb-8">
          Please enter your email, the OTP sent to it, and your new password.
        </p>

        {error && (
          <div className="mb-4 text-red-100 bg-red-600/70 px-3 py-2 rounded text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Your registered email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-900 placeholder-gray-400"
            required
            autoComplete="email"
          />

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-900 placeholder-gray-400"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-900 placeholder-gray-400"
            required
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-md transition shadow-md shadow-cyan-400/50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-6 text-center text-white/90">
          Remembered your password?{' '}
          <Link href="/login" className="underline hover:text-cyan-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
