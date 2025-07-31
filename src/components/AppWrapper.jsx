'use client';

import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

const PUBLIC_PATHS = ['/login', '/register', '/reset-password', '/req-reset'];

export default function AppWrapper({ children }) {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();

  // Check if current route is public (no sidebar)
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Show sidebar only if user is logged in and not on public page
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
