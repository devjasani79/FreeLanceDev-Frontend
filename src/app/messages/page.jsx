'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import LoadingSpinner from '@/components/ui/Spinner';

export default function Messages() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Messages
            </h1>
            <p className="text-muted-foreground text-lg">
              Communicate with your {user.role === 'freelancer' ? 'clients' : 'freelancers'}
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className="card text-center py-16">
            <div className="text-muted-foreground mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-medium text-foreground mb-2">
                Messages Coming Soon
              </h3>
              <p className="text-muted-foreground mb-6">
                We're working on a comprehensive messaging system to help you communicate effectively with your {user.role === 'freelancer' ? 'clients' : 'freelancers'}.
              </p>
              <p className="text-sm text-muted-foreground">
                In the meantime, you can use the contact information provided in your orders/projects.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 