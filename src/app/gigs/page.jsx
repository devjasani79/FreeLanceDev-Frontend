'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import api from '@/utils/api';
import Spinner from '@/components/Spinner';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/footer';
import Link from 'next/link';

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    api
      .get('/gigs')
      .then((res) => setGigs(res.data))
      .catch(() => setGigs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || authLoading) return <Spinner />;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-10">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800">Explore Freelance Gigs</h1>

        {!user && (
          <div className="flex justify-end gap-4 mb-6">
            <Link
              href="/login"
              className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Register
            </Link>
          </div>
        )}

        {gigs.length === 0 ? (
          <div className="text-gray-500">No gigs found.</div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {gigs.map((gig) => {
              const thumb = gig.gigThumbnail;
              const displayPrice = gig.pricePlans?.reduce(
                (min, p) => (p.price < min ? p.price : min),
                gig.pricePlans?.[0]?.price ?? 0
              );

              return (
                <div
                  key={gig._id}
                  className="bg-white shadow-md hover:shadow-indigo-300 transition-shadow duration-200 rounded-xl p-5 flex flex-col"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={gig.title}
                      className="rounded-md h-40 w-full object-cover mb-4"
                    />
                  ) : (
                    <div className="h-40 w-full bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-400 mb-4">
                      No Image
                    </div>
                  )}

                  <h2 className="font-semibold text-lg text-gray-900 truncate">{gig.title}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{gig.desc}</p>
                  <span className="text-indigo-600 font-semibold mt-2">₹{displayPrice}</span>

                  <Link
                    href={`/gigs/${gig._id}`}
                    className="mt-auto bg-indigo-600 text-white py-2 text-center rounded-md hover:bg-indigo-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
