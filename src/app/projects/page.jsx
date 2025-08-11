'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Projects() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to orders page since projects and orders are the same for clients
    router.push('/orders');
  }, [router]);

  return null;
} 