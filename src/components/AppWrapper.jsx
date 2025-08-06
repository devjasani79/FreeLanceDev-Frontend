'use client';

import { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Spinner from './Spinner';

const PUBLIC_PATHS = ['/login', '/register', '/reset-password', '/req-reset'];

export default function AppWrapper({ children }) {
  const { user, loading } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.push('/gigs');
    }
  }, [loading, user, isPublic, pathname]);

  if (loading) return <Spinner />;

  const showSidebar = user && !isPublic;

  return (
    <div className="min-h-screen flex">
      {showSidebar && <Sidebar />}
      <main className={`${showSidebar ? 'ml-0 md:ml-64' : 'ml-0'} flex-1 p-6`}>
        {children}
      </main>
    </div>
  );
}
