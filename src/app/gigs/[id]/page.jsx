'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import Spinner from '@/components/Spinner';
import Link from 'next/link';

export default function GigDetailPage() {
  const { id } = useParams(); // get the gig id from url
  const router = useRouter();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api.get(`/gigs/${id}`)
      .then((res) => {
        setGig(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.msg || 'Failed to load gig');
        setGig(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!gig) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>

      {/* Seller info */}
      <div className="flex items-center mb-4 space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          {gig.user?.profilePic ? (
            <img
              src={gig.user.profilePic}
              alt={gig.user.name}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              {gig.user?.name?.[0] || 'U'}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold">{gig.user?.name}</p>
          <p className="text-sm text-gray-500 capitalize">{gig.user?.role}</p>
        </div>
      </div>

      {/* Images carousel */}
      {gig.images && gig.images.length > 0 && (
        <div className="mb-6 space-x-2 overflow-x-auto flex pb-2">
          {gig.images.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Gig image ${idx + 1}`}
              className="w-48 h-36 object-cover rounded cursor-pointer"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Description */}
      <p className="mb-6 whitespace-pre-wrap">{gig.desc}</p>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-gray-700"><strong>Category:</strong> {gig.category}</p>
        </div>
        <div>
          <p className="text-gray-700"><strong>Price:</strong> ${gig.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-700"><strong>Delivery Time:</strong> {gig.deliveryTime} day(s)</p>
        </div>
        <div>
          <p className="text-gray-700"><strong>Revisions:</strong> {gig.revisions}</p>
        </div>
      </div>

      {/* Keywords */}
      {gig.keywords && gig.keywords.length > 0 && (
        <div className="mb-6">
          <p className="text-gray-700 font-semibold mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {gig.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-4">
        {/* Placeholder for Buy button - extend with your own order/payment flow */}
        <button
          className="px-6 py-2 bg-indigo-600 rounded text-white font-semibold hover:bg-indigo-700 transition"
          onClick={() => alert('Buy flow coming soon!')}
        >
          Buy Now
        </button>

        <button
          className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>
    </div>
  );
}
