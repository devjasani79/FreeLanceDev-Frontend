'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import AuthForm from '@/components/ui/AuthForm';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';

export default function RequestResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Send request to backend
      await api.post('/auth/request-reset', { email });

      // Instead of just showing a message, redirect with email prefilled
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err?.response?.data?.msg || 'Failed to send reset email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthForm title="Reset your password">
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-white/80">
        <Link href="/auth/login" className="underline">
          Back to sign in
        </Link>
      </div>
    </AuthForm>
  );
}
