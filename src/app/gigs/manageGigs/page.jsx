'use client';

import { useContext, useEffect, useState } from 'react';
import api from '@/utils/api';
import { AuthContext } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

const ManageGigsPage = () => {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

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
                      onClick={() => alert('Edit functionality coming soon')}
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
    </div>
  );
};

export default ManageGigsPage;
