'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Spinner from '@/components/Spinner';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  // Redirect to login if user not authenticated
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!user || authLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-64 p-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user.name} 👋</h1>
        <p className="text-lg text-gray-600 mb-8">
          You are logged in as a{' '}
          <span className="font-semibold capitalize text-blue-600">{user.role}</span>.
        </p>

        {/* Quick Action Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {user.role === 'freelancer' && (
            <>
              <DashboardCard
                title="Create Gig"
                description="Create a new service gig to offer your skills."
                href="/gigs/createGig"
              />
              <DashboardCard
                title="Manage Gigs"
                description="View, edit, or delete your existing gigs."
                href="/gigs/manageGigs"
              />
              <DashboardCard
                title="Orders"
                description="Track your current orders and earnings."
                href="/orders" // implement orders later
              />
            </>
          )}
          {user.role === 'client' && (
            <>
              <DashboardCard
                title="Browse Gigs"
                description="Explore gigs from freelancers."
                href="/gigs"
              />
              <DashboardCard
                title="My Orders"
                description="View your active and past orders."
                href="/orders" // implement orders later
              />
              <DashboardCard
                title="Messages"
                description="Chat with freelancers."
                href="/messages" // implement messaging later
              />
            </>
          )}
        </section>

        <section>
          {/* You can add recent activity, stats, or news here */}
          <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
          <p className="text-gray-700">
            Use the links above to get started with your freelance marketplace activities.
          </p>
        </section>
      </main>
    </div>
  );
}

function DashboardCard({ title, description, href }) {
  return (
    <Link
      href={href}
      className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition flex flex-col cursor-pointer"
    >
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <span className="mt-4 text-blue-600 font-semibold underline">Go &rarr;</span>
    </Link>
  );
}
