'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import OrdersList from '@/components/orders/OrdersList';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderStats from '@/components/orders/OrderStats';
import LoadingSpinner from '@/components/ui/Spinner';

export default function OrdersPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchOrders();
      fetchStats();
    }
  }, [user, loading, router]);

  useEffect(() => {
    applyFilters();
  }, [orders, filters]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/orders/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filter by search
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.gigId?.title?.toLowerCase().includes(searchTerm) ||
        order.buyerId?.name?.toLowerCase().includes(searchTerm) ||
        order.sellerId?.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const daysAgo = new Date(now.getTime() - (parseInt(filters.dateRange) * 24 * 60 * 60 * 1000));
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= daysAgo;
      });
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleOrderUpdate = (orderId, updates) => {
    setOrders(prev => 
      prev.map(order => 
        order._id === orderId ? { ...order, ...updates } : order
      )
    );
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <Container>
        {/* Header */}
        <div className="py-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {user.role === 'freelancer' ? 'My Orders' : 'My Purchases'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {user.role === 'freelancer' 
              ? 'Manage your freelance orders and deliveries'
              : 'Track your purchased gigs and projects'
            }
          </p>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="mb-8 animate-slide-in-left">
            <OrderStats stats={stats} userRole={user.role} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 animate-slide-in-left">
          <OrderFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            userRole={user.role}
          />
        </div>

        {/* Orders List */}
        <div className="animate-slide-in-left">
          <OrdersList 
            orders={filteredOrders}
            userRole={user.role}
            onOrderUpdate={handleOrderUpdate}
            onRefresh={fetchOrders}
          />
        </div>
      </Container>
    </div>
  );
} 