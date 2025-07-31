'use client';

import { useState, useEffect, useContext } from 'react';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

export default function ProfilePage() {
  const { token, user, loading: authLoading, logout } = useContext(AuthContext);

  // Local form state for editable profile fields
  const [form, setForm] = useState({
    name: '',
    bio: '',
    skills: '', // comma separated string
  });

  // Profile pic upload preview and file
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Status / Error messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Prefill form when user loads or changes
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || '',
      bio: user.bio || '',
      skills: user.skills?.join(', ') || '',
    });
    setProfilePicPreview(user.profilePic || '');
  }, [user]);

  // Preview profile pic when file selected
  useEffect(() => {
    if (!profilePicFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicPreview(reader.result);
    };
    reader.readAsDataURL(profilePicFile);

    // Cleanup on unmount
    return () => {
      if (reader.readyState === 1) reader.abort();
    };
  }, [profilePicFile]);

  if (authLoading || !user) return <Spinner />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
    }
  };

  // Update profile text fields (name, bio, skills)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const updates = {
        name: form.name.trim(),
        bio: form.bio.trim(),
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      await api.put('/auth/update', updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Profile updated successfully');

      // Ideally, refresh the user context or reload user info here
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Upload/update profile picture
  const handleUploadProfilePic = async (e) => {
    e.preventDefault();
    if (!profilePicFile) {
      setError('Please select an image to upload.');
      return;
    }

    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append('image', profilePicFile);

      const res = await api.put('/auth/profile-pic', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Profile picture updated');
      setProfilePicFile(null);
      setProfilePicPreview(res.data.user.profilePic);

      // Optionally refresh the user context here
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile picture');
    } finally {
      setUpdating(false);
    }
  };

  // Optional: Logout user
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{success}</div>
      )}

      {/* Profile Picture */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Profile Picture</h2>
        <div className="mb-4 flex items-center space-x-6">
          {profilePicPreview ? (
            <img
              src={profilePicPreview}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <form onSubmit={handleUploadProfilePic} className="flex flex-col space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handlePicChange}
              className="file-input file-input-bordered file-input-sm max-w-xs"
            />
            <button
              type="submit"
              disabled={updating}
              className="btn btn-primary btn-sm mt-1"
            >
              {updating ? 'Uploading...' : 'Update Picture'}
            </button>
          </form>
        </div>
      </section>

      {/* Profile Info Form */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Profile Information</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
          <div>
            <label htmlFor="name" className="block font-medium mb-1 text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input w-full"
              type="text"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block font-medium mb-1 text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="input w-full resize-none"
              placeholder="Short description about yourself"
            />
          </div>

          <div>
            <label htmlFor="skills" className="block font-medium mb-1 text-gray-700">
              Skills (comma separated)
            </label>
            <input
              id="skills"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Photoshop"
              className="input w-full"
              type="text"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="btn btn-primary"
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

    </div>
  );
}
