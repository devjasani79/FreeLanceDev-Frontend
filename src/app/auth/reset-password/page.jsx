'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import AuthForm from '@/components/ui/AuthForm';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialEmail = searchParams.get('email') || '';

  const [form, setForm] = useState({
    email: initialEmail,
    otp: '',
    newPassword: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', form);

      if (res.data.success) {
        setMessage('Your password has been updated. Redirecting to login...');
        // Redirect after short delay
        setTimeout(() => router.push('/auth/login'), 1500);
      } else {
        setError(res.data.msg || 'Failed to reset password');
      }
    } catch (err) {
      setError(
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        'Failed to reset password'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthForm title="Set a new password">
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <InputField
          label="OTP"
          name="otp"
          value={form.otp}
          onChange={onChange}
          required
        />
        <InputField
          label="New password"
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={onChange}
          required
        />
        {message && <p className="text-green-400 text-sm">{message}</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update password'}
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
