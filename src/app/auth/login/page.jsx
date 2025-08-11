// src/app/auth/login/page.jsx
'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import AuthForm from '@/components/ui/AuthForm';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthForm title="Welcome back">
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          required
          placeholder="you@example.com"
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
          placeholder="••••••••"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-white/80">
        <Link href="/auth/request-reset" className="underline">Forgot password?</Link>
        <span className="mx-2">·</span>
        <Link href="/auth/register" className="underline">Create account</Link>
      </div>
    </AuthForm>
  );
}
