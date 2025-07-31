'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Link from 'next/link';
export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  // Form state with all fields and initial values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client', // default role
    bio: '',
    skills: '', // comma separated for freelancers only
  });

  const [profilePic, setProfilePic] = useState(null); // File object
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Preview profilePic when file changes
  useEffect(() => {
    if (!profilePic) {
      setProfilePicPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProfilePicPreview(reader.result);
    reader.readAsDataURL(profilePic);

    return () => {
      if (reader.readyState === 1) reader.abort();
    };
  }, [profilePic]);

  // Handle text inputs and select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle role change clears role-specific inputs if needed
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setFormData((prev) => ({
      ...prev,
      role,
      skills: role === 'freelancer' ? prev.skills : '',
      // You might keep or clear bio depending on UX, here keeping it
    }));
  };

  // Handle profile pic file change
  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePic(file);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Build FormData for multipart upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);

      if (formData.bio.trim()) data.append('bio', formData.bio.trim());

      // Only include skills if freelancer and non-empty
      if (formData.role === 'freelancer' && formData.skills.trim()) {
        // Convert comma separated to JSON string for backend parsing
        const skillsArray = formData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        // Append as JSON string since multer parses normal strings as strings
        data.append('skills', JSON.stringify(skillsArray));
      }

      if (profilePic) {
        data.append('profilePic', profilePic);
      }

      // Make POST request
      const res = await api.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // On success, log user in and redirect
      login(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex flex-col items-center justify-center px-4 py-8">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
          Create Your Account
        </h2>
        <p className="text-white/90 text-center mb-6">
          Join FreelanceDev and start your freelancing journey!
        </p>

        {error && (
          <div className="mb-4 text-red-100 bg-red-600/70 px-3 py-2 rounded text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-900 placeholder-gray-400"
            required
            autoComplete="name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-900 placeholder-gray-400"
            required
            autoComplete="email"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-900 placeholder-gray-400"
            required
            autoComplete="new-password"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 text-gray-900"
            required
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>

          {/* Bio input (optional for all users) */}
          <textarea
            name="bio"
            placeholder="Tell us about yourself (optional)"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-900 placeholder-gray-400 resize-none"
          />

          {/* Skills input only for freelancers */}
          {formData.role === 'freelancer' && (
            <input
              type="text"
              name="skills"
              placeholder="Your skills (comma separated)"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-white/90 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-900 placeholder-gray-400"
            />
          )}

          {/* Profile picture upload */}
          <div>
            <label htmlFor="profilePic" className="block text-white mb-2 font-medium">
              Upload Profile Picture (optional)
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="w-full text-white"
            />
            {profilePicPreview && (
              <img
                src={profilePicPreview}
                alt="Profile preview"
                className="mt-2 w-24 h-24 object-cover rounded-full border border-white/40"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-md transition shadow-md shadow-indigo-500/50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-white/90">
          Already have an account?{' '}
          <Link href="/login" className="underline hover:text-indigo-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
