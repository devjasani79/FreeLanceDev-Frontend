'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import Spinner from '@/components/Spinner';

export default function GigDetailPage() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGig() {
      try {
        const { data } = await api.get(`/gigs/${id}`);
        setGig(data);
      } catch (err) {
        console.error('Failed to fetch gig details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchGig();
  }, [id]);

  if (loading || !gig) return <Spinner />;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <img src={gig.gigThumbnail} alt={gig.title} className="w-full h-64 object-cover rounded-md mb-6" />
        <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
        <p className="text-gray-700 mb-4">{gig.desc}</p>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p><strong>Category:</strong> {gig.category}</p>
          <p><strong>Price Range:</strong> {gig.pricePlans?.[0]?.price} - {gig.pricePlans?.[2]?.price}</p>
        </div>
      </div>
    </div>
  );
}
