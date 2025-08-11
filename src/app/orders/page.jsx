'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import OrdersList from '@/components/orders/OrdersList';
import LoadingSpinner from '@/components/ui/Spinner';

export default function Orders() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    try {
      // In a real app, you'd fetch orders from your API
      // For now, we'll simulate the data
      const mockOrders = user.role === 'freelancer' ? [
        {
          id: 1,
          title: 'Website Design for Restaurant',
          client: 'John Doe',
          status: 'active',
          price: 500,
          deadline: '2024-02-15',
          progress: 75,
          type: 'order'
        },
        {
          id: 2,
          title: 'Mobile App Development',
          client: 'Jane Smith',
          status: 'pending',
          price: 1200,
          deadline: '2024-03-01',
          progress: 0,
          type: 'order'
        }
      ] : [
        {
          id: 1,
          title: 'E-commerce Website',
          freelancer: 'Sarah Wilson',
          status: 'active',
          price: 800,
          deadline: '2024-02-20',
          progress: 60,
          type: 'project'
        },
        {
          id: 2,
          title: 'Brand Identity Design',
          freelancer: 'Alex Chen',
          status: 'review',
          price: 350,
          deadline: '2024-02-10',
          progress: 90,
          type: 'project'
        }
      ];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {user.role === 'freelancer' ? 'My Orders' : 'My Projects'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {user.role === 'freelancer' 
                ? 'Track and manage your incoming work requests' 
                : 'Monitor the progress of your projects'
              }
            </p>
          </div>

          {/* Orders List */}
          <OrdersList 
            orders={orders} 
            userRole={user.role}
          />
        </div>
      </Container>
    </div>
  );
} 