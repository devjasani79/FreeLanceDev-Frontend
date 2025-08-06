'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';

export default function GigDetailPage() {
  const params = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGig() {
      try {
        const res = await api.get(`/gigs/${params.id}`);
        setGig(res.data);
      } catch (err) {
        console.error('Error fetching gig:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGig();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (!gig) return <p>Gig not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
      <p className="text-gray-700 mb-6">{gig.desc}</p>

      {/* GIG PLANS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gig.pricePlans?.map((plan) => (
          <div key={plan.tier} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold capitalize">{plan.tier} Plan</h2>
            <p className="text-lg font-bold text-green-600">₹{plan.price}</p>
            <p>Delivery in {plan.deliveryTime} days</p>
            <p>{plan.revisions} Revisions</p>
            <ul className="list-disc pl-4 mt-2">
              {Array.isArray(plan.features)
                ? plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                : null}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQs */}
      {gig.faqs?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">FAQs</h2>
          {gig.faqs.map((faq, idx) => (
            <div key={idx} className="mb-4">
              <p className="font-bold">{faq.question}</p>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Requirements */}
      {gig.requirements?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Requirements</h2>
          <ul className="list-disc pl-6">
            {gig.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      {gig.keywords?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Keywords:</h3>
          <div className="flex gap-2 flex-wrap mt-2">
            {gig.keywords.map((k, i) => (
              <span key={i} className="bg-gray-200 text-sm px-2 py-1 rounded">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
