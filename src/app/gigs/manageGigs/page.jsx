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

  // For create gig form state
  const [createForm, setCreateForm] = useState({
    title: '',
    desc: '',
    price: '',
    category: '',
    keywords: '',
    deliveryTime: '',
    revisions: '',
  });
  const [createImages, setCreateImages] = useState([]);
  const [creating, setCreating] = useState(false);

  // For edit overlay state
  const [editGig, setEditGig] = useState(null); // gig object being edited
  const [editForm, setEditForm] = useState(null);
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
      <div className="p-6 max-w-xl mx-auto text-center text-red-600">
        Access denied: Only freelancers can manage gigs.
      </div>
    );
  }

  // Create gig handlers
  const handleCreateChange = (e) => {
    setCreateForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleCreateImageChange = (e) => {
    setCreateImages([...e.target.files]);
  };
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const formData = new FormData();
      Object.entries(createForm).forEach(([k, v]) => formData.append(k, v));
      createImages.forEach(img => formData.append('images', img));
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
      setCreateImages([]);
      alert('Gig created successfully!');
    } catch (err) {
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
    setEditImages([]);
  };

  const closeEditModal = () => {
    setEditGig(null);
    setEditForm(null);
    setEditImages([]);
  };

  const handleEditChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditImageChange = (e) => {
    setEditImages([...e.target.files]);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
      editImages.forEach(img => formData.append('images', img));
      const res = await api.put(`/gigs/${editGig._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setGigs(prev => prev.map(g => (g._id === editGig._id ? res.data.gig : g)));
      closeEditModal();
      alert('Gig updated successfully!');
    } catch (err) {
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
    <div className="p-8 max-w-5xl mx-auto">
      {/* Create Gig Form */}
      <section className="mb-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create New Gig</h2>
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <input name="title" placeholder="Gig title" required className="input" value={createForm.title} onChange={handleCreateChange} />
          <textarea name="desc" placeholder="Describe your service..." required className="input resize-none" rows={3} value={createForm.desc} onChange={handleCreateChange} />
          <input name="price" type="number" min="5" placeholder="Price in ₹" required className="input" value={createForm.price} onChange={handleCreateChange} />
          <select name="category" value={createForm.category} onChange={handleCreateChange} className="input" required>
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
          </select>
          <input name="keywords" placeholder="Keywords (comma separated)" className="input" value={createForm.keywords} onChange={handleCreateChange} />
          <input name="deliveryTime" type="number" min="1" placeholder="Delivery Time (in days)" required className="input" value={createForm.deliveryTime} onChange={handleCreateChange} />
          <input name="revisions" type="number" min="0" placeholder="Number of Revisions" className="input" value={createForm.revisions} onChange={handleCreateChange} />
          <input type="file" multiple accept="image/*" className="input" onChange={handleCreateImageChange} />
          {createImages.length > 0 && <p className="text-gray-600 text-sm">{createImages.length} image(s) selected</p>}
          <button type="submit" disabled={creating} className="btn">{creating ? <Spinner /> : 'Create Gig'}</button>
        </form>
      </section>

      {/* List of Gigs */}
      <section>
        <h2 className="text-xl font-bold mb-4">My Gigs</h2>
        {gigs.length === 0 && <p className="text-gray-600">No gigs created yet.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gigs.map(gig => (
            <div key={gig._id} className="bg-white rounded shadow p-4 flex flex-col">
              {gig.images && gig.images.length > 0 ? (
                <img src={gig.images[0]} alt={gig.title} className="w-full h-36 object-cover rounded mb-4" loading="lazy" />
              ) : (
                <div className="w-full h-36 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-400">No image</div>
              )}
              <h3 className="font-semibold text-lg">{gig.title}</h3>
              <p className="text-gray-600 mb-2 line-clamp-3">{gig.desc}</p>
              <p className="text-indigo-600 font-bold mb-4">₹{gig.price}</p>
              <div className="mt-auto flex space-x-3">
                <button 
                  onClick={() => openEditModal(gig)} 
                  className="btn bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(gig._id)} 
                  className="btn border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Gig Modal */}
      {editGig && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-2xl w-full relative overflow-auto max-h-[90vh]">
            <button 
              onClick={closeEditModal} 
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-xl font-bold"
              aria-label="Close edit modal"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Gig</h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input name="title" placeholder="Gig title" value={editForm.title} onChange={handleEditChange} required className="input" />
              <textarea name="desc" placeholder="Describe your service..." rows={3} value={editForm.desc} onChange={handleEditChange} required className="input resize-none" />
              <input name="price" type="number" min="5" placeholder="Price in ₹" value={editForm.price} onChange={handleEditChange} required className="input" />
              <select name="category" value={editForm.category} onChange={handleEditChange} className="input" required>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
              </select>
              <input name="keywords" placeholder="Keywords (comma separated)" value={editForm.keywords} onChange={handleEditChange} className="input" />
              <input name="deliveryTime" type="number" min="1" placeholder="Delivery Time (in days)" value={editForm.deliveryTime} onChange={handleEditChange} required className="input" />
              <input name="revisions" type="number" min="0" placeholder="Number of Revisions" value={editForm.revisions} onChange={handleEditChange} className="input" />
              <input type="file" multiple accept="image/*" onChange={handleEditImageChange} className="input" />
              {editImages.length > 0 && <p className="text-gray-600 text-sm">{editImages.length} image(s) selected</p>}
              <button type="submit" disabled={updating} className="btn">{updating ? <Spinner /> : 'Update Gig'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
