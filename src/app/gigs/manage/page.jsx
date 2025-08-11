'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import GigManagementList from '@/components/gigs/GigManagementList';
import LoadingSpinner from '@/components/ui/Spinner';
import api from '@/utils/api';

export default function ManageGigs() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [gigs, setGigs] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role !== 'freelancer') {
      router.push('/dashboard');
      return;
    }

    if (user) {
      fetchMyGigs();
    }
  }, [user, loading, router]);

  const fetchMyGigs = async () => {
    try {
      const response = await api.get('/gigs/my');
      setGigs(response.data);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      setMessage({ type: 'error', text: 'Failed to fetch gigs' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
      try {
        await api.delete(`/gigs/${gigId}`);
        setGigs(gigs.filter(gig => gig._id !== gigId));
        setMessage({ type: 'success', text: 'Gig deleted successfully' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete gig' });
      }
    }
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

  if (!user || user.role !== 'freelancer') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Manage My Gigs
              </h1>
              <p className="text-muted-foreground text-lg">
                View, edit, and manage your service offerings
              </p>
            </div>
            <button
              onClick={() => router.push('/gigs/create')}
              className="btn btn-primary"
            >
              Create New Gig
            </button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Gig Management List */}
          <GigManagementList 
            gigs={gigs} 
            onDelete={handleDeleteGig}
            onEdit={(gigId) => router.push(`/gigs/edit/${gigId}`)}
          />
        </div>
      </Container>
    </div>
  );
} 