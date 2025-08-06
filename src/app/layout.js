// src/app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

// Load modern Google font
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'FreeLanceDev | Find Top Freelance Talent',
  description: 'A professional freelance marketplace connecting developers and clients for high-quality gigs.',
  keywords: ['freelance', 'developer', 'gigs', 'marketplace', 'remote work'],
  authors: [{ name: 'FreeLanceDev Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.className} font-sans bg-gray-50 text-gray-900 antialiased min-h-screen`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
