'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Spinner from '@/components/Spinner';
import Link from 'next/link';
import api from '@/utils/api';
import Footer from '@/components/footer';

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [profile, setProfile] = useState({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', skills: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token]);

  useEffect(() => {
    if (user) {
      setProfile(user);
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        skills: (user.skills || []).join(', '),
      });
    }
  }, [user]);

  if (authLoading || !user) return <Spinner fullScreen />;

  const handleEditToggle = () => {
    setMessage('');
    setEditing(!editing);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage('');

    try {
      const res = await api.put(
        '/auth/update',
        {
          name: form.name.trim(),
          bio: form.bio.trim(),
          skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Profile update failed.');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <div className="flex flex-1">
        <Sidebar active="dashboard" />

        <main className="flex-1 p-6 md:pl-72">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          {/* Profile Section */}
          <section className="bg-white p-6 rounded-xl shadow-md mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">My Profile</h2>
              <button
                onClick={handleEditToggle}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {message && (
              <div
                className={`mb-4 px-4 py-3 rounded-md font-medium ${
                  message.includes('failed')
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <InputField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                editing={editing}
              />

              <TextareaField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                editing={editing}
              />

              <InputField
                label="Skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                editing={editing}
                placeholder="e.g. React, Figma, UI/UX"
              />

              {editing && (
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {updateLoading ? 'Saving...' : 'Save Profile'}
                </button>
              )}
            </form>
          </section>

          {/* Role-specific Quick Actions */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {user.role === 'freelancer' ? (
              <>
                <ActionCard title="Create Gig" href="/gigs/createGig" />
                <ActionCard title="Manage Gigs" href="/gigs/manageGigs" />
                <ActionCard title="My Orders" href="/orders" />
              </>
            ) : (
              <>
                <ActionCard title="Browse Gigs" href="/gigs" />
                <ActionCard title="My Orders" href="/orders" />
                <ActionCard title="Messages" href="/messages" />
              </>
            )}
          </section>

          {/* Overview Placeholder */}
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-700">
              Welcome to your dashboard. Use the quick action cards above to manage your activity.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

function ActionCard({ title, href }) {
  return (
    <Link href={href}>
      <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <span className="text-blue-600 font-bold text-sm">Go →</span>
      </div>
    </Link>
  );
}

function InputField({ label, name, value, onChange, editing, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {editing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring focus:ring-blue-200"
        />
      ) : (
        <p className="text-gray-800">{value || '-'}</p>
      )}
    </div>
  );
}

function TextareaField({ label, name, value, onChange, editing }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {editing ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring focus:ring-blue-200"
        />
      ) : (
        <p className="text-gray-800 whitespace-pre-line">{value || '-'}</p>
      )}

      
    </div>
    
  );
}
