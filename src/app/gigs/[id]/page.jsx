'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';
import Container from '@/components/layout/Container';
import GigDetail from '@/components/gig/GigDetail';
import Spinner from '@/components/ui/Spinner';

export default function GigDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchGig = async () => {
      try {
        const { data } = await api.get(`/gigs/${id}`);
        setGig(data.gig || data);
      } catch (err) {
        setError(err?.response?.data?.msg || 'Failed to load gig');
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <Container className="py-8"><p className="text-red-500">{error}</p></Container>;
  if (!gig) return <Container className="py-8"><p className="text-muted-foreground">Gig not found.</p></Container>;

  return (
    <Container className="py-8">
      <GigDetail gig={gig} />
    </Container>
  );
} 