'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/api';
import Spinner from '@/components/Spinner';

export default function GigDetailPage() {
  const { id } = useParams();
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
      .catch(() => {
        setError('Failed to load gig');
        setGig(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
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
          className="mt-4 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!gig) return null;

  const displayPrice = gig.pricePlans?.reduce(
    (min, p) => (p.price < min ? p.price : min),
    gig.pricePlans?.[0]?.price ?? 0
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-6">{gig.title}</h1>

      {/* Seller Info */}
      <div className="flex items-center mb-8 space-x-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
          {gig.user?.profilePic ? (
            <img
              src={gig.user.profilePic}
              alt={gig.user.name}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-bold uppercase">
              {gig.user?.name?.[0] || 'U'}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-lg">{gig.user?.name}</p>
          <p className="text-gray-500 capitalize">{gig.user?.role}</p>
        </div>
      </div>

      {/* Main Thumbnail */}
      {gig.gigThumbnail ? (
        <img
          src={gig.gigThumbnail}
          alt={gig.title}
          className="rounded-lg w-full h-72 object-cover mb-6 shadow-md"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-72 bg-gray-200 rounded-lg mb-6 flex items-center justify-center text-gray-400">
          No thumbnail image available
        </div>
      )}

      {/* Additional Images Carousel */}
      {gig.gigImages && gig.gigImages.length > 0 && (
        <div className="mb-8 flex gap-4 overflow-x-auto">
          {gig.gigImages.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Additional image ${idx + 1}`}
              className="h-36 object-cover rounded-lg cursor-pointer flex-shrink-0"
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Description */}
      <p className="mb-8 whitespace-pre-wrap text-gray-700">{gig.desc}</p>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 text-gray-700 font-medium">
        <div>
          <strong>Category:</strong> <span className="capitalize">{gig.category}</span>
        </div>
        <div>
          <strong>Starting Price:</strong> ₹{displayPrice}
        </div>
        <div>
          <strong>Delivery Time:</strong> {gig.pricePlans?.[0]?.deliveryTime ?? 'N/A'} day(s)
        </div>
        <div>
          <strong>Revisions:</strong> {gig.pricePlans?.[0]?.revisions ?? 'N/A'}
        </div>
      </div>

      {/* Keywords */}
      {gig.keywords && gig.keywords.length > 0 && (
        <div className="mb-8">
          <p className="font-semibold text-gray-800 mb-3">Tags:</p>
          <div className="flex flex-wrap gap-3">
            {gig.keywords.map((kw, idx) => (
              <span
                key={idx}
                className="bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-sm select-none"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => alert('Buy flow coming soon!')}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 active:scale-95 transition"
        >
          Buy Now
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
