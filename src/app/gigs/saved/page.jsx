'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import LoadingSpinner from '@/components/ui/Spinner';
import { HeartIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function SavedGigs() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [savedGigs, setSavedGigs] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== 'client') {
      router.push('/dashboard');
      return;
    }

    if (user) {
      fetchSavedGigs();
    }
  }, [user, loading, router]);

  const fetchSavedGigs = async () => {
    try {
      // In a real app, you'd fetch saved gigs from your API
      // For now, we'll simulate the data
      const mockSavedGigs = [
        {
          id: 1,
          title: 'Professional Logo Design',
          freelancer: 'Sarah Wilson',
          price: 150,
          rating: 4.8,
          category: 'design',
          savedAt: '2024-01-15'
        },
        {
          id: 2,
          title: 'E-commerce Website Development',
          freelancer: 'Alex Chen',
          price: 800,
          rating: 4.9,
          category: 'development',
          savedAt: '2024-01-20'
        }
      ];

      setSavedGigs(mockSavedGigs);
    } catch (error) {
      console.error('Error fetching saved gigs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSaved = (gigId) => {
    setSavedGigs(prev => prev.filter(gig => gig.id !== gigId));
  };

  if (loading || isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (!user || user.role !== 'client') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Saved Gigs
            </h1>
            <p className="text-muted-foreground text-lg">
              Your bookmarked services and favorite freelancers
            </p>
          </div>

          {/* Saved Gigs List */}
          {savedGigs.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-muted-foreground mb-4">
                <HeartIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-foreground mb-2">
                  No saved gigs yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start browsing gigs and save the ones you like for later.
                </p>
                <button
                  onClick={() => router.push('/gigs')}
                  className="btn btn-primary"
                >
                  Browse Gigs
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedGigs.map((gig, index) => (
                <div 
                  key={gig.id}
                  className="card hover-lift group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {gig.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {gig.freelancer}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{gig.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground capitalize">{gig.category}</span>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        ${gig.price}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleRemoveSaved(gig.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Remove from saved"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/gigs/${gig.id}`)}
                      className="btn btn-primary flex-1 text-sm"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="btn btn-outline text-sm">
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
} 