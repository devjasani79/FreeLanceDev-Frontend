'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Link from 'next/link';
export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/auth/request-reset', { email });
      alert('OTP sent to your email');
      router.push('/reset-password');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 flex flex-col items-center justify-center px-4 py-8">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
          Forgot Password?
        </h2>
        <p className="text-white/90 text-center mb-8">
          Enter your registered email to receive a password reset OTP.
        </p>

        {error && (
          <div className="mb-4 text-red-100 bg-red-600/70 px-3 py-2 rounded text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-gray-900 placeholder-gray-400"
            required
            autoComplete="email"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-md transition shadow-md shadow-pink-400/50"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <p className="mt-6 text-center text-white/90">
          Remember your password?{' '}
          <Link href="/login" className="underline hover:text-pink-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
