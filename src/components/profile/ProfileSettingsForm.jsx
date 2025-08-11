'use client';

import { useState } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  CameraIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import api from '@/utils/api';

export default function ProfileSettingsForm({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    skills: user.skills || []
  });
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.profilePic || '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Update profile info
      const updateData = new FormData();
      updateData.append('name', formData.name);
      updateData.append('bio', formData.bio);
      updateData.append('skills', JSON.stringify(formData.skills));

      if (profilePic) {
        updateData.append('image', profilePic);
      }

      const response = await api.put('/auth/update', updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Reset profile pic state
        setProfilePic(null);
        if (previewUrl && previewUrl !== user.profilePic) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(response.data.user.profilePic || '');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.msg || 'Failed to update profile';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/auth/delete');
        // Redirect to home page after account deletion
        window.location.href = '/';
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete account' });
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="card">
        <h3 className="text-xl font-semibold text-foreground mb-6">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
              <CameraIcon className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-2">Update Profile Picture</h4>
            <p className="text-sm text-muted-foreground">
              Upload a new profile picture. Supported formats: JPG, PNG, GIF (max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Profile Information</h3>
        
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input pl-10"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              value={user.email}
              className="input pl-10 bg-neutral-100 dark:bg-neutral-700 cursor-not-allowed"
              disabled
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Email address cannot be changed
          </p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="input resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Skills (Freelancers only) */}
        {user.role === 'freelancer' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Skills
            </label>
            <div className="space-y-3">
              {/* Add new skill */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="input flex-1"
                  placeholder="Add a new skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn btn-primary px-4"
                  disabled={!newSkill.trim()}
                >
                  Add
                </button>
              </div>
              
              {/* Skills list */}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-primary hover:text-primary-dark transition-colors"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Role (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Account Type
          </label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-neutral-100 dark:bg-neutral-700 text-foreground rounded-lg capitalize">
              {user.role}
            </span>
            <p className="text-xs text-muted-foreground">
              Account type cannot be changed
            </p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <TrashIcon className="w-5 h-5" />
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary flex-1"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="card border-red-200 dark:border-red-800">
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="btn btn-error"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 