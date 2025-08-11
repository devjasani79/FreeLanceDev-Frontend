'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/gigs', label: 'Manage Gigs' },
  { href: '/dashboard/orders', label: 'Orders' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-neutral-700 p-6 space-y-6">
      <div className="text-2xl font-bold text-primary">FreelanceHub</div>
      <nav className="space-y-2">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-md font-medium transition ${
              pathname === link.href
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
