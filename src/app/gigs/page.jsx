'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import Container from '@/components/layout/Container';
import GigCard from '@/components/gig/GigCard';
import Spinner from '@/components/ui/Spinner';

export default function GigsPage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const { data } = await api.get('/gigs');
        setGigs(data.gigs || data);
      } catch (err) {
        setError(err?.response?.data?.msg || 'Failed to load gigs');
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Browse gigs</h1>
        <Link href="/gigs/new" className="text-primary hover:underline">Post a gig</Link>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {gigs.length === 0 ? (
        <p className="text-muted-foreground">No gigs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </Container>
  );
} 