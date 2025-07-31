'use client';

import { useContext, useEffect, useState } from 'react';
import api from '@/utils/api';
import Spinner from '@/components/Spinner';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    api
      .get('/gigs')
      .then((res) => setGigs(res.data))
      .catch(() => setGigs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || authLoading) return <Spinner />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 ">Available Gigs</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {gigs.map((gig) => (
          <div
            key={gig._id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col transition transform hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-300 cursor-pointer"
            tabIndex={0} // Make it keyboard focusable for accessibility
            role="group"
            aria-label={`View details for ${gig.title}`}
          >
            {gig.images && gig.images.length > 0 ? (
              <img
                src={gig.images[0]}
                alt={gig.title}
                className="w-full h-44 object-cover rounded-md mb-4 drop-shadow"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-44 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}

            <h2 className="font-semibold text-xl mb-2 text-gray-900 truncate">{gig.title}</h2>

            <p className="text-gray-600 mb-3 line-clamp-3">{gig.desc}</p>

            <span className="text-indigo-600 text-lg font-semibold mb-4">₹{gig.price}</span>

            <Link
              href={`/gigs/${gig._id}`}
              className="mt-auto inline-block bg-indigo-600 text-white py-2 rounded-md font-semibold text-center hover:bg-indigo-700 transition"
            >
              View Gig
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
