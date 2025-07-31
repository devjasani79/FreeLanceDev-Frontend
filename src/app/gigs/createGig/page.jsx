'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

const categories = [
  'design',
  'development',
  'marketing',
  'business',
  'writing',
  'video',
  'music',
];

export default function CreateGigPage() {
  const { token, user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: '',
    desc: '',
    price: '',
    category: '',
    keywords: '',
    deliveryTime: '',
    revisions: '',
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleThumbnailChange = (e) => {
    if (e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    } else {
      setThumbnail(null);
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== 'freelancer') return;
    if (!thumbnail) {
      alert('Please select a thumbnail image.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('gigThumbnail', thumbnail);
      images.forEach((file) => formData.append('gigImages', file));
      await api.post('/gigs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/gigs');
    } catch (err) {
      alert('Error creating gig');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <Spinner />;
  if (user?.role !== 'freelancer') {
    return (
      <div className="p-8 max-w-md mx-auto text-center text-gray-700">
        <p className="text-red-600 font-semibold">
          Access denied: Only freelancers can create gigs.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 select-none tracking-tight">
        Create a New Gig
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">Gig Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Professional Logo Design"
            required
            className="input border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition rounded-md shadow-sm w-full"
          />
        </label>

        {/* Description */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Description
          </span>
          <textarea
            name="desc"
            value={form.desc}
            onChange={handleChange}
            placeholder="Describe your service..."
            required
            rows={4}
            className="input border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition rounded-md shadow-sm w-full resize-none"
          />
        </label>

        {/* Price */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">Price (₹)</span>
          <input
            name="price"
            type="number"
            min="5"
            value={form.price}
            onChange={handleChange}
            placeholder="50"
            required
            className="input border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition rounded-md shadow-sm w-full"
          />
        </label>

        {/* Category */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">Category</span>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="input border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition rounded-md shadow-sm w-full cursor-pointer"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </label>

        {/* Keywords */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Keywords (comma separated)
          </span>
          <input
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            placeholder="logo, branding, design"
            className="input border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition rounded-md shadow-sm w-full"
          />
        </label>

        {/* Delivery Time */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Delivery Time (days)
          </span>
          <input
            name="deliveryTime"
            type="number"
            min="1"
            value={form.deliveryTime}
            onChange={handleChange}
            placeholder="2"
            required
            className="input border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition rounded-md shadow-sm w-full"
          />
        </label>

        {/* Revisions */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Number of Revisions
          </span>
          <input
            name="revisions"
            type="number"
            min="0"
            value={form.revisions}
            onChange={handleChange}
            placeholder="1"
            className="input border-gray-300 focus:border-gray-700 focus:ring-2 focus:ring-gray-300 transition rounded-md shadow-sm w-full"
          />
        </label>

        {/* Thumbnail Upload */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">
            Gig Thumbnail <span className="text-red-500">*</span>
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
            className="block w-full cursor-pointer border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          {thumbnail && (
            <p className="mt-1 text-gray-600 text-sm select-text">
              Selected: {thumbnail.name}
            </p>
          )}
        </label>

        {/* Additional Images Upload */}
        <label className="block">
          <span className="text-gray-700 font-semibold mb-1 block">Additional Images</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full cursor-pointer border border-gray-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          {images.length > 0 && (
            <p className="mt-1 text-gray-600 text-sm select-text">
              {images.length} file{images.length > 1 ? 's' : ''} selected
            </p>
          )}
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white font-bold rounded-md shadow-lg
            hover:bg-gray-800 active:scale-95 transition transform duration-150
            disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : 'Create Gig'}
        </button>
      </form>
    </div>
  );
}
