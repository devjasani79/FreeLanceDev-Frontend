'use client';

import { Suspense } from 'react';
import HeroBar from '@/components/layout/HeroBar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import Spinner from '@/components/ui/Spinner';

export default function LayoutClient({ children }) {
  return (
    <>
      {/* Fixed HeroBar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <HeroBar />
      </header>

      {/* Fixed Sidebar */}
      <aside className="fixed top-[88px] left-0 bottom-0 w-64 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-r border-gray-200 dark:border-neutral-800 z-40">
        <Sidebar />
      </aside>

      {/* Scrollable main content */}
      <main className="ml-64 pt-[88px] min-h-screen overflow-y-auto pb-[60px]">
        <Suspense fallback={<div className="flex justify-center py-10"><Spinner /></div>}>
          {children}
        </Suspense>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-64 right-0 z-50">
        <Footer />
      </footer>
    </>
  );
}
