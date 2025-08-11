'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LegacyGigCardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/gigs');
  }, [router]);
  return null;
}
