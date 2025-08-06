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

    const openEditModal = (gig) => {
      setEditGig(gig);
      setEditForm({
        title: gig.title,
        desc: gig.desc,
        price: gig.price || 0,
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

    const handleEditChange = (e) =>
      setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleEditThumbnailChange = (e) =>
      setEditThumbnail(e.target.files?.[0] || null);

    const handleEditImageChange = (e) =>
      setEditImages([...e.target.files]);

    const handleEditSubmit = async (e) => {
      e.preventDefault();
      setUpdating(true);
      try {
        const formData = new FormData();
        Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
        if (editThumbnail) formData.append('gigThumbnail', editThumbnail);
        editImages.forEach(img => formData.append('gigImages', img));

        const res = await api.put(`/gigs/${editGig._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        setGigs(prev => prev.map(g => (g._id === editGig._id ? res.data.gig : g)));
        closeEditModal();
        alert('Gig updated successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to update gig');
      } finally {
        setUpdating(false);
      }
    };

    const handleDelete = async (id) => {
      if (!confirm('Are you sure you want to delete this gig?')) return;
      try {
        await api.delete(`/gigs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGigs(prev => prev.filter(g => g._id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete gig');
      }
    };

    return (
      <div className="p-8 max-w-6xl mx-auto text-gray-900">
        <section>
          <h2 className="text-2xl font-extrabold mb-6 select-none">My Gigs</h2>
          {gigs.length === 0 ? (
            <p className="text-gray-600">You haven't created any gigs yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gigs.map(gig => {
                const thumb = gig.gigThumbnail;
                const displayPrice = gig.pricePlans?.reduce(
                  (min, p) => (p.price < min ? p.price : min),
                  gig.pricePlans?.[0]?.price ?? gig.price ?? 0
                );

                return (
                  <div
                    key={gig._id}
                    className="bg-white rounded-xl shadow-md p-5 flex flex-col hover:scale-[1.03] hover:shadow-xl transition-transform"
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={gig.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
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
                        onClick={() => openEditModal(gig)}
                        className="btn bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                      >
                        Edit
                      </button>
                      <button
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

        {editGig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full relative overflow-auto max-h-[90vh]">
              <button
                onClick={closeEditModal}
                className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-2xl font-bold"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-6">Edit Gig</h2>
              {editForm && (
                <form onSubmit={handleEditSubmit} className="space-y-5">
                  <input name="title" value={editForm.title} onChange={handleEditChange} required className="input" />
                  <textarea name="desc" rows={3} value={editForm.desc} onChange={handleEditChange} required className="input resize-none" />
                  <input name="price" type="number" value={editForm.price} onChange={handleEditChange} className="input" />
                  <select name="category" value={editForm.category} onChange={handleEditChange} className="input">
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                  <input name="keywords" value={editForm.keywords} onChange={handleEditChange} className="input" />
                  <input name="deliveryTime" type="number" value={editForm.deliveryTime} onChange={handleEditChange} className="input" />
                  <input name="revisions" type="number" value={editForm.revisions} onChange={handleEditChange} className="input" />
                  <input type="file" accept="image/*" onChange={handleEditThumbnailChange} />
                  <input type="file" multiple accept="image/*" onChange={handleEditImageChange} />
                  <button type="submit" disabled={updating} className="btn w-full py-3 bg-gray-900 text-white font-bold rounded-md">
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
