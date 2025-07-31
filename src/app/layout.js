// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import AppWrapper from '@/components/AppWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Fiverr Clone',
  description: 'Freelancer marketplace built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <AppWrapper>{children}</AppWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
