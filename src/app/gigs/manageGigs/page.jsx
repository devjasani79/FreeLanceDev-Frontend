'use client';

import { useContext, useEffect, useState } from 'react';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

const categories = ['design', 'development', 'marketing', 'business', 'writing', 'video', 'music'];

export default function ManageGigsPage() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create gig form state
  const [createForm, setCreateForm] = useState({
    title: '',
    desc: '',
    price: '',
    category: '',
    keywords: '',
    deliveryTime: '',
    revisions: '',
  });
  const [createThumbnail, setCreateThumbnail] = useState(null);
  const [createImages, setCreateImages] = useState([]);
  const [creating, setCreating] = useState(false);

  // Edit modal state
  const [editGig, setEditGig] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editThumbnail, setEditThumbnail] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api.get('/gigs/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setGigs(res.data))
      .catch(() => setGigs([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (authLoading || loading) return <Spinner />;

  if (!user || user.role !== 'freelancer') {
    return (
      <div className="p-8 max-w-xl mx-auto text-center text-red-700 font-semibold">
        Access denied: Only freelancers can manage gigs.
      </div>
    );
  }

  // Handlers for create form
  const handleCreateChange = (e) => {
    setCreateForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleCreateThumbnailChange = (e) => {
    if (e.target.files.length > 0) setCreateThumbnail(e.target.files[0]);
    else setCreateThumbnail(null);
  };
  const handleCreateImageChange = (e) => setCreateImages([...e.target.files]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createThumbnail) {
      alert('Thumbnail image is required');
      return;
    }
    setCreating(true);
    try {
      const formData = new FormData();
      Object.entries(createForm).forEach(([k, v]) => formData.append(k, v));
      formData.append('gigThumbnail', createThumbnail);
      createImages.forEach(img => formData.append('gigImages', img));
      const res = await api.post('/gigs', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setGigs(prev => [res.data.gig, ...prev]);
      setCreateForm({
        title: '',
        desc: '',
        price: '',
        category: '',
        keywords: '',
        deliveryTime: '',
        revisions: '',
      });
      setCreateThumbnail(null);
      setCreateImages([]);
      alert('Gig created successfully!');
    } catch {
      alert('Error creating gig');
    } finally {
      setCreating(false);
    }
  };

  // Edit modal handlers
  const openEditModal = (gig) => {
    setEditGig(gig);
    setEditForm({
      title: gig.title,
      desc: gig.desc,
      price: gig.price,
      category: gig.category,
      keywords: gig.keywords.join(', '),
      deliveryTime: gig.deliveryTime,
      revisions: gig.revisions,
    });
    setEditThumbnail(null);
    setEditImages([]);
  };

  const closeEditModal = () => {
    setEditGig(null);
    setEditForm(null);
    setEditThumbnail(null);
    setEditImages([]);
  };

  const handleEditChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditThumbnailChange = (e) => {
    if (e.target.files.length > 0) setEditThumbnail(e.target.files[0]);
    else setEditThumbnail(null);
  };

  const handleEditImageChange = (e) => setEditImages([...e.target.files]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
      if (editThumbnail) formData.append('gigThumbnail', editThumbnail);
      editImages.forEach(img => formData.append('gigImages', img));

      const res = await api.put(`/gigs/${editGig._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setGigs(prev => prev.map(g => (g._id === editGig._id ? res.data.gig : g)));
      closeEditModal();
      alert('Gig updated successfully!');
    } catch {
      alert('Failed to update gig');
    } finally {
      setUpdating(false);
    }
  };

  // Delete gig handler
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this gig?')) return;
    try {
      await api.delete(`/gigs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setGigs(prev => prev.filter(g => g._id !== id));
    } catch {
      alert('Failed to delete gig');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-gray-900">
      {/* Create Gig Form */}
      <section className="mb-12 p-8 bg-white rounded-xl shadow-md border border-gray-300">
        <h2 className="text-2xl font-extrabold mb-6 select-none">Create New Gig</h2>
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <input
            name="title"
            placeholder="Gig title"
            required
            className="input"
            value={createForm.title}
            onChange={handleCreateChange}
          />
          <textarea
            name="desc"
            placeholder="Describe your service..."
            required
            className="input resize-none"
            rows={3}
            value={createForm.desc}
            onChange={handleCreateChange}
          />
          <input
            name="price"
            type="number"
            min="5"
            placeholder="Price in ₹"
            required
            className="input"
            value={createForm.price}
            onChange={handleCreateChange}
          />
          <select 
            name="category" 
            value={createForm.category} 
            onChange={handleCreateChange} 
            className="input" 
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <input
            name="keywords"
            placeholder="Keywords (comma separated)"
            className="input"
            value={createForm.keywords}
            onChange={handleCreateChange}
          />
          <input
            name="deliveryTime"
            type="number"
            min="1"
            placeholder="Delivery Time (in days)"
            required
            className="input"
            value={createForm.deliveryTime}
            onChange={handleCreateChange}
          />
          <input
            name="revisions"
            type="number"
            min="0"
            placeholder="Number of Revisions"
            className="input"
            value={createForm.revisions}
            onChange={handleCreateChange}
          />
          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">Gig Thumbnail (required)</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCreateThumbnailChange}
              required
              className="block w-full cursor-pointer rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {createThumbnail && (
              <p className="mt-1 text-gray-600 text-sm select-text">Selected: {createThumbnail.name}</p>
            )}
          </label>
          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">Additional Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleCreateImageChange}
              className="block w-full cursor-pointer rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            {createImages.length > 0 && (
              <p className="mt-1 text-gray-600 text-sm select-text">{createImages.length} file(s) selected</p>
            )}
          </label>
          <button
            type="submit"
            disabled={creating}
            className="btn w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-md shadow-md transition duration-150 active:scale-95 disabled:opacity-60"
          >
            {creating ? <Spinner /> : 'Create Gig'}
          </button>
        </form>
      </section>

      {/* List of Gigs */}
      <section>
        <h2 className="text-2xl font-extrabold mb-6 select-none">My Gigs</h2>
        {gigs.length === 0 ? (
          <p className="text-gray-600">No gigs created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map(gig => {
              // Show thumbnail, fallback to no-image
              const thumb = gig.gigThumbnail;
              // Show Basic price or lowest
              const displayPrice = gig.pricePlans?.reduce(
                (min, p) => (p.price < min ? p.price : min),
                gig.pricePlans[0]?.price ?? 0
              );
              return (
                <div key={gig._id} className="bg-white rounded-xl shadow-md p-5 flex flex-col hover:scale-[1.03] hover:shadow-xl transition-transform cursor-pointer">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={gig.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  <h3 className="font-semibold text-lg truncate">{gig.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-3">{gig.desc}</p>
                  <p className="text-indigo-600 font-bold mb-4">₹{displayPrice}</p>
                  <div className="mt-auto flex space-x-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(gig)}
                      className="btn bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(gig._id)}
                      className="btn border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Edit Gig Modal */}
      {editGig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full relative overflow-auto max-h-[90vh]">
            <button
              onClick={closeEditModal}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-2xl font-bold"
              aria-label="Close edit modal"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 select-none">Edit Gig</h2>
            {editForm && (
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <input
                  name="title"
                  placeholder="Gig title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="input"
                />
                <textarea
                  name="desc"
                  placeholder="Describe your service..."
                  rows={3}
                  value={editForm.desc}
                  onChange={handleEditChange}
                  required
                  className="input resize-none"
                />
                <input
                  name="price"
                  type="number"
                  min="5"
                  placeholder="Price in ₹"
                  value={editForm.price}
                  onChange={handleEditChange}
                  required
                  className="input"
                />
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="input"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  name="keywords"
                  placeholder="Keywords (comma separated)"
                  value={editForm.keywords}
                  onChange={handleEditChange}
                  className="input"
                />
                <input
                  name="deliveryTime"
                  type="number"
                  min="1"
                  placeholder="Delivery Time (in days)"
                  value={editForm.deliveryTime}
                  onChange={handleEditChange}
                  required
                  className="input"
                />
                <input
                  name="revisions"
                  type="number"
                  min="0"
                  placeholder="Number of Revisions"
                  value={editForm.revisions}
                  onChange={handleEditChange}
                  className="input"
                />
                <label className="block">
                  <span className="text-gray-700 font-semibold mb-1 block">
                    Replace Gig Thumbnail (optional)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files.length > 0) setEditThumbnail(e.target.files[0]);
                      else setEditThumbnail(null);
                    }}
                    className="block w-full cursor-pointer rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700 font-semibold mb-1 block">
                    Add Additional Images
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setEditImages([...e.target.files])}
                    className="block w-full cursor-pointer rounded-md border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  {editImages.length > 0 && (
                    <p className="mt-1 text-gray-600 text-sm select-text">
                      {editImages.length} file{editImages.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </label>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn w-full py-3 bg-gray-900 text-white font-bold rounded-md shadow-lg hover:bg-gray-800 active:scale-95 transition duration-150 disabled:opacity-60"
                >
                  {updating ? <Spinner /> : 'Update Gig'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
