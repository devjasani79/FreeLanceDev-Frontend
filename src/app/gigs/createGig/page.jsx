'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

const categories = ['design', 'development', 'marketing', 'business', 'writing', 'video', 'music'];

export default function CreateGigPage() {
  const { token, user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleImageChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== 'freelancer') return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach((file) => formData.append('images', file));
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
      <div className="p-6">
        <p className="text-red-600">Access denied: Only freelancers can create gigs.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">Create a New Gig</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Gig title"
          required
          className="input focus:ring-2 focus:ring-indigo-500 focus:outline-none transition rounded-md"
        />
        <textarea
          name="desc"
          value={form.desc}
          onChange={handleChange}
          placeholder="Describe your service..."
          required
          className="input resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition rounded-md"
          rows={4}
        />
        <input
          name="price"
          type="number"
          min="5"
          value={form.price}
          onChange={handleChange}
          placeholder="Price in ₹"
          required
          className="input focus:ring-2 focus:ring-indigo-500 focus:outline-none transition rounded-md"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="input focus:ring-2 focus:ring-indigo-500 focus:outline-none transition rounded-md"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <input
          name="keywords"
          value={form.keywords}
          onChange={handleChange}
          placeholder="Keywords"
          className="input focus:ring-2 focus:ring-indigo-500 focus:outline-none transition rounded-md"
        />
        <input
          name="deliveryTime"
          type="number"
          min="1"
          value={form.deliveryTime}
          onChange={handleChange}
          placeholder="Delivery Time (in days)"
          required
          className="input focus:ring-2 focus:ring-indigo-500 focus:outline-none transition rounded-md"
        />
        <input
          name="revisions"
          type="number"
          min="0"
          value={form.revisions}
          onChange={handleChange}
          placeholder="Number of Revisions"
          className="input focus:ring-2 focus:ring-indigo-500 focus:outline-none transition rounded-md"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="input"
        />
        {images.length > 0 && (
          <p className="text-gray-600 text-sm">{images.length} image(s) selected.</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn w-full bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg active:scale-95 text-white font-bold py-3 rounded"
        >
          {loading ? <Spinner /> : 'Create Gig'}
        </button>
      </form>
    </div>
  );
}
