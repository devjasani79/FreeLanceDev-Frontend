import './globals.css';

export const metadata = {
  title: 'Fiverr Clone',
  description: 'Freelancer Marketplace built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
