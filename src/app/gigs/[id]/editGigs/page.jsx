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

  const [existingThumbnail, setExistingThumbnail] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // current gig images
  const [imagesToDelete, setImagesToDelete] = useState([]); // images marked for deletion
  const [newThumbnail, setNewThumbnail] = useState(null);   // new thumbnail to upload
  const [newImages, setNewImages] = useState([]);           // new images to upload

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
          price: gig.pricePlans?.[0]?.price || '',
          category: gig.category,
          keywords: gig.keywords.join(', '),
          deliveryTime: gig.pricePlans?.[0]?.deliveryTime || '',
          revisions: gig.pricePlans?.[0]?.revisions || '',
        });

        setExistingThumbnail(gig.gigThumbnail);
        setExistingImages(gig.gigImages || []);
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
      <div className="p-6 max-w-xl mx-auto text-center text-red-600 font-semibold">
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

  const handleNewThumbnailChange = (e) => {
    if (e.target.files.length > 0) setNewThumbnail(e.target.files[0]);
    else setNewThumbnail(null);
  };

  const handleNewImagesChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const toggleImageToDelete = (imgUrl) => {
    setImagesToDelete((prev) =>
      prev.includes(imgUrl) ? prev.filter((img) => img !== imgUrl) : [...prev, imgUrl]
    );
  };

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
      formData.append('keywords', form.keywords);
      formData.append('deliveryTime', parseInt(form.deliveryTime, 10));
      formData.append('revisions', parseInt(form.revisions || '0', 10));
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));

      if (newThumbnail) formData.append('gigThumbnail', newThumbnail);
      newImages.forEach((file) => formData.append('gigImages', file));

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

  // Carousel logic to show existing images with navigation and deletion state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const nextImage = () => setCarouselIndex((i) => (i + 1) % existingImages.length);
  const prevImage = () => setCarouselIndex((i) => (i - 1 + existingImages.length) % existingImages.length);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Gig</h1>

      {error && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Gig Title"
          value={form.title}
          onChange={handleChange}
          required
          className="input"
        />

        {/* Description */}
        <textarea
          name="desc"
          placeholder="Gig Description"
          value={form.desc}
          onChange={handleChange}
          required
          rows={4}
          className="input resize-none"
        />

        {/* Price */}
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

        {/* Category */}
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

        {/* Keywords */}
        <input
          type="text"
          name="keywords"
          placeholder="Keywords (comma separated)"
          value={form.keywords}
          onChange={handleChange}
          className="input"
        />

        {/* Delivery Time */}
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

        {/* Revisions */}
        <input
          type="number"
          name="revisions"
          min="0"
          placeholder="Number of Revisions"
          value={form.revisions}
          onChange={handleChange}
          className="input"
        />

        {/* Existing Thumbnail preview */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Existing Thumbnail</label>
          {existingThumbnail ? (
            <img
              src={existingThumbnail}
              alt="Existing Thumbnail"
              className="w-48 h-48 object-cover rounded"
              loading="lazy"
            />
          ) : (
            <p>No thumbnail uploaded</p>
          )}
        </div>

        {/* Upload New Thumbnail */}
        <label className="block mb-2 font-semibold">Replace Gig Thumbnail (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleNewThumbnailChange}
          className="input mb-4"
        />
        {newThumbnail && <p className="text-sm text-gray-700 mb-4 select-text">Selected: {newThumbnail.name}</p>}

        {/* Existing Images Carousel */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Existing Images</label>
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
                className={`w-64 h-64 object-cover rounded ${
                  imagesToDelete.includes(existingImages[carouselIndex])
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

        {/* Upload New Images */}
        <label className="block mb-2 font-semibold" htmlFor="images">
          Add New Images (optional)
        </label>
        <input
          type="file"
          name="images"
          id="images"
          multiple
          accept="image/*"
          onChange={handleNewImagesChange}
          className="input"
        />
        {newImages.length > 0 && (
          <p className="mt-2 text-sm text-gray-600 select-text">{newImages.length} image(s) selected</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded"
        >
          {submitting ? <Spinner /> : 'Update Gig'}
        </button>
      </form>
    </div>
  );
}
