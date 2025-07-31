'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

const categories = ['design', 'development', 'marketing', 'business', 'writing', 'video', 'music'];

export default function EditGigPage() {
  const { id } = useParams();
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    desc: '',
    price: '',
    category: '',
    keywords: '',
    deliveryTime: '',
    revisions: '',
  });

  const [images, setImages] = useState([]); // new images to upload
  const [existingImages, setExistingImages] = useState([]); // current gig images
  const [imagesToDelete, setImagesToDelete] = useState([]); // old images marked for deletion

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchGig = async () => {
      try {
        const res = await api.get(`/gigs/${id}`);
        const gig = res.data;

        if (user?._id !== gig.user._id) {
          alert('You are not authorized to edit this gig');
          router.push('/gigs');
          return;
        }

        setForm({
          title: gig.title,
          desc: gig.desc,
          price: gig.price,
          category: gig.category,
          keywords: gig.keywords.join(', '),
          deliveryTime: gig.deliveryTime,
          revisions: gig.revisions,
        });

        setExistingImages(gig.images || []);
      } catch (err) {
        console.error('Failed to load gig', err);
        setError('Failed to load gig details');
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id, token, user, router]);

  if (authLoading || loading) return <Spinner />;

  if (!user || user.role !== 'freelancer') {
    return (
      <div className="p-6 max-w-xl mx-auto text-center text-red-600">
        Access denied: Only freelancers can edit gigs.
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Handler to mark existing image for deletion
  const toggleImageToDelete = (imgUrl) => {
    setImagesToDelete((prev) =>
      prev.includes(imgUrl) ? prev.filter((img) => img !== imgUrl) : [...prev, imgUrl]
    );
  };

  // Carousel with simple prev/next logic:
  const [carouselIndex, setCarouselIndex] = useState(0);
  const nextImage = () => setCarouselIndex((i) => (i + 1) % existingImages.length);
  const prevImage = () =>
    setCarouselIndex((i) => (i - 1 + existingImages.length) % existingImages.length);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('desc', form.desc);
      formData.append('price', parseFloat(form.price));
      formData.append('category', form.category);
      formData.append('deliveryTime', parseInt(form.deliveryTime, 10));
      formData.append('revisions', parseInt(form.revisions || '0', 10));
      formData.append('keywords', form.keywords);

      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

      // Append new images (optional)
      images.forEach((file) => formData.append('images', file));

      await api.put(`/gigs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Gig updated successfully!');
      router.push('/gigs/manageGigs');
    } catch (err) {
      console.error('Update gig error:', err);
      setError(err.response?.data?.message || 'Failed to update gig');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Gig</h1>

      {error && (
        <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Fields... */}
        <input
          type="text"
          name="title"
          placeholder="Gig Title"
          value={form.title}
          onChange={handleChange}
          required
          className="input"
        />

        <textarea
          name="desc"
          placeholder="Gig Description"
          value={form.desc}
          onChange={handleChange}
          required
          className="input resize-none"
          rows={4}
        />

        <input
          type="number"
          name="price"
          min="5"
          placeholder="Price in ₹"
          value={form.price}
          onChange={handleChange}
          required
          className="input"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="input"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="keywords"
          placeholder="Keywords (comma separated)"
          value={form.keywords}
          onChange={handleChange}
          className="input"
        />

        <input
          type="number"
          name="deliveryTime"
          min="1"
          placeholder="Delivery Time (days)"
          value={form.deliveryTime}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          type="number"
          name="revisions"
          min="0"
          placeholder="Number of Revisions"
          value={form.revisions}
          onChange={handleChange}
          className="input"
        />

        {/* Existing Images Carousel with delete mark */}
        <div>
          <label className="block mb-2 font-semibold">Existing Images</label>

          {existingImages.length > 0 ? (
            <div className="relative w-64 h-64 mx-auto">
              <button
                type="button"
                onClick={prevImage}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded"
                aria-label="Previous image"
              >
                ‹
              </button>

              <img
                src={existingImages[carouselIndex]}
                alt={`Existing image ${carouselIndex + 1}`}
                className={`w-64 h-64 object-cover rounded ${imagesToDelete.includes(
                  existingImages[carouselIndex]
                )
                  ? 'opacity-50 grayscale'
                  : ''
                }`}
                loading="lazy"
              />

              <button
                type="button"
                onClick={nextImage}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded"
                aria-label="Next image"
              >
                ›
              </button>

              <button
                type="button"
                onClick={() => toggleImageToDelete(existingImages[carouselIndex])}
                className={`absolute bottom-2 right-2 px-3 py-1 rounded text-white ${
                  imagesToDelete.includes(existingImages[carouselIndex]) ? 'bg-red-600' : 'bg-green-600'
                }`}
              >
                {imagesToDelete.includes(existingImages[carouselIndex]) ? 'Undo Remove' : 'Remove'}
              </button>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No images uploaded yet.</p>
          )}
        </div>

        {/* New Images Input */}
        <div>
          <label className="block mb-2 font-semibold" htmlFor="images">
            Add New Images (optional)
          </label>
          <input
            type="file"
            name="images"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="input"
          />
          {images.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">{images.length} image(s) selected</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded"
        >
          {submitting ? <Spinner /> : 'Update Gig'}
        </button>
      </form>
    </div>
  );
}
