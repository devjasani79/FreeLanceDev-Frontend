'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

export default function EditGigPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: '',
    keywords: '',
    pricePlans: [],
    faqs: [],
    requirements: [],
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        const gig = res.data;
        setFormData({
          title: gig.title,
          desc: gig.desc,
          category: gig.category,
          keywords: gig.keywords.join(', '),
          pricePlans: gig.pricePlans || [],
          faqs: gig.faqs || [],
          requirements: gig.requirements || [],
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch gig:', err);
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePricePlanChange = (index, field, value) => {
    const updated = [...formData.pricePlans];
    updated[index][field] = value;
    setFormData({ ...formData, pricePlans: updated });
  };

  const handleFaqChange = (index, field, value) => {
    const updated = [...formData.faqs];
    updated[index][field] = value;
    setFormData({ ...formData, faqs: updated });
  };

  const handleRequirementChange = (index, value) => {
    const updated = [...formData.requirements];
    updated[index] = value;
    setFormData({ ...formData, requirements: updated });
  };

  const addPricePlan = () => {
    setFormData({
      ...formData,
      pricePlans: [...formData.pricePlans, { tier: '', desc: '', deliveryTime: '', revisions: '', price: '', features: '' }],
    });
  };

  const addFaq = () => {
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { question: '', answer: '' }],
    });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ''],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          updatedData.append(key, JSON.stringify(value));
        } else {
          updatedData.append(key, value);
        }
      });

      if (thumbnail) updatedData.append('gigThumbnail', thumbnail);
      images.forEach((file) => updatedData.append('gigImages', file));

      const res = await api.put(`/gigs/${id}`, updatedData);
      router.push(`/gigs/${id}`);
    } catch (err) {
      console.error('Error updating gig:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-8 lg:px-20 xl:px-40">
      <div className="bg-white rounded-xl shadow-xl p-8 space-y-10">
        <h1 className="text-3xl font-bold text-gray-900">Edit Gig</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-md shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-md shadow-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-md shadow-sm"
            />
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium mb-1">Keywords (comma separated)</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-3 rounded-md shadow-sm"
            />
          </div>

          {/* Price Plans */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Price Plans</h2>
            {formData.pricePlans.map((plan, idx) => (
              <div key={idx} className="bg-gray-50 border rounded-lg p-4 space-y-3 mb-6">
                <input
                  value={plan.tier}
                  placeholder="Tier"
                  onChange={(e) => handlePricePlanChange(idx, 'tier', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  value={plan.desc}
                  placeholder="Description"
                  onChange={(e) => handlePricePlanChange(idx, 'desc', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  value={plan.price}
                  placeholder="Price"
                  onChange={(e) => handlePricePlanChange(idx, 'price', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  value={plan.deliveryTime}
                  placeholder="Delivery Time"
                  onChange={(e) => handlePricePlanChange(idx, 'deliveryTime', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  value={plan.revisions}
                  placeholder="Revisions"
                  onChange={(e) => handlePricePlanChange(idx, 'revisions', e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  value={plan.features}
                  placeholder="Features (comma separated)"
                  onChange={(e) => handlePricePlanChange(idx, 'features', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <button type="button" onClick={addPricePlan} className="text-blue-600 font-medium hover:underline">
              + Add Price Plan
            </button>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-xl font-semibold mb-4">FAQs</h2>
            {formData.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border rounded p-4 mb-4">
                <input
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <button type="button" onClick={addFaq} className="text-blue-600 font-medium hover:underline">
              + Add FAQ
            </button>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            {formData.requirements.map((req, idx) => (
              <input
                key={idx}
                value={req}
                onChange={(e) => handleRequirementChange(idx, e.target.value)}
                placeholder="Requirement"
                className="w-full p-2 border rounded mb-2"
              />
            ))}
            <button type="button" onClick={addRequirement} className="text-blue-600 font-medium hover:underline">
              + Add Requirement
            </button>
          </div>

          {/* Uploads */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Gig Thumbnail</label>
              <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0])} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Additional Gig Images</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files))} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
