// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Spinner from '@/components/ui/Spinner';
import ThemeProviderClient from '@/components/layout/ThemeProviderClient';

const inter = Inter({ subsets: ['latin'] });

// Default SEO metadata
export const metadata = {
  title: {
    default: 'FreelanceDev',
    template: '%s | FreelanceDev',
  },
  description: 'Hire and work with top freelance developers worldwide.',
  keywords: [
    'freelance',
    'developers',
    'hire developers',
    'freelance jobs',
    'gig platform',
    'remote work',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freelancedev.com',
    siteName: 'FreelanceDev',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FreelanceDev Preview',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body
        className={`${inter.className} bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProviderClient>
          <AuthProvider>
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-1">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[50vh]">
                    <Spinner />
                  </div>
                }
              >
                {children}
              </Suspense>
            </main>

            {/* Footer */}
            <Footer />
          </AuthProvider>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
