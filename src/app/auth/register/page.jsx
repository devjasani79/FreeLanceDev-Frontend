'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import AuthForm from '@/components/ui/AuthForm';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    bio: '',
    skills: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // For backend: skills should be array, convert before sending
      let skillsArray = [];
      if (form.skills.trim()) {
        skillsArray = form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }

      await register({
        ...form,
        skills: skillsArray,
      });
    } catch (err) {
      setError(
        err?.response?.data?.msg ||
        err?.response?.data?.error ||
        err.message ||
        'Registration failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthForm title="Create your account">
      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Name"
          name="name"
          value={form.name}
          onChange={onChange}
          required
          placeholder="Your name"
        />

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

        {/* Role selection */}
        <div>
          <label className="block text-sm mb-1 font-medium text-white/80">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={form.role}
            onChange={onChange}
            required
            className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select a role</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>

        {/* Optional Bio */}
        <div>
          <label className="block text-sm mb-1 font-medium text-white/80">
            Bio <span className="text-xs text-white/60">(optional)</span>
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={3}
            className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Optional Skills */}
        <div>
          <label className="block text-sm mb-1 font-medium text-white/80">
            Skills (comma separated) <span className="text-xs text-white/60">(optional)</span>
          </label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={onChange}
            className="w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            placeholder="e.g. React, Node.js, Marketing"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-white/80">
        <span>Already have an account? </span>
        <Link href="/auth/login" className="underline">
          Sign in
        </Link>
      </div>
    </AuthForm>
  );
}
