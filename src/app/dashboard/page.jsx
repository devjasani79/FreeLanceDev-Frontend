'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentGigs from '@/components/dashboard/RecentGigs';
import ProfileCard from '@/components/dashboard/ProfileCard';
import QuickActions from '@/components/dashboard/QuickActions';
import EarningsChart from '@/components/dashboard/EarningsChart';
import LoadingSpinner from '@/components/ui/Spinner';

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    try {
      // In a real app, you'd fetch this from your API
      // For now, we'll simulate the data
      const mockData = {
        stats: {
          totalGigs: user.role === 'freelancer' ? 12 : 0,
          activeOrders: user.role === 'freelancer' ? 3 : 5,
          totalEarnings: user.role === 'freelancer' ? 2450 : 0,
          completedProjects: user.role === 'freelancer' ? 28 : 12,
          totalSpent: user.role === 'client' ? 3200 : 0,
          savedGigs: user.role === 'client' ? 8 : 0,
        },
        recentGigs: [],
        earnings: []
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <Container>
        {/* Header */}
        <div className="py-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your {user.role === 'freelancer' ? 'freelancing business' : 'projects'} today.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <DashboardStats 
              stats={dashboardData?.stats} 
              userRole={user.role}
              className="animate-slide-in-left" 
            />

            {/* Recent Gigs/Orders */}
            <RecentGigs 
              userRole={user.role}
              className="animate-slide-in-left" 
            />

            {/* Earnings Chart (Freelancers only) */}
            {user.role === 'freelancer' && (
              <div className="card animate-slide-in-left">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Earnings Overview
                </h3>
                <EarningsChart data={dashboardData?.earnings} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8 animate-slide-in-right">
            {/* Profile Card */}
            <ProfileCard user={user} />

            {/* Quick Actions */}
            <QuickActions userRole={user.role} />
          </div>
        </div>
      </Container>
    </div>
  );
} 