'use client';

import Link from 'next/link';
import Container from '@/components/layout/Container';

export default function HeroBar() {
  return (
    <div className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
      <Container className="py-4 flex items-center justify-between">
        <div className="font-semibold">FreelanceDev</div>
        <div className="text-sm text-muted-foreground">
          <Link href="/gigs" className="hover:underline">Explore gigs</Link>
        </div>
      </Container>
    </div>
  );
}
