'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function LegacyGigInfoPage() {
  const { id } = useParams();
  const router = useRouter();
  useEffect(() => {
    if (id) router.replace(`/gigs/${id}`);
  }, [id, router]);
  return null;
}
