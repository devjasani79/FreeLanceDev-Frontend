'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyGigInfoIndexRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/gigs');
  }, [router]);
  return null;
} 