'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import CreateGigForm from '@/components/gigs/CreateGigForm';
import LoadingSpinner from '@/components/ui/Spinner';

export default function CreateGig() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== 'freelancer') {
      router.push('/dashboard');
      return;
    }

    setIsLoading(false);
  }, [user, loading, router]);

  if (loading || isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (!user || user.role !== 'freelancer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Create New Gig
            </h1>
            <p className="text-muted-foreground text-lg">
              Showcase your skills and start earning money
            </p>
          </div>

          {/* Create Gig Form */}
          <CreateGigForm />
        </div>
      </Container>
    </div>
  );
} 