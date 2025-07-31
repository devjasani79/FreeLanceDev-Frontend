'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useContext, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Explore', href: '/gigs' },
    user?.role === 'freelancer' ? { name: 'Manage Gigs', href: '/gigs/manageGigs' } : null,
    { name: 'Profile', href: '/profile' },
  ].filter(Boolean);

  const toggleSidebar = () => setIsOpen((v) => !v);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <>
      {/* Hamburger button for small screens */}
      <button
        className="fixed top-4 left-4 z-[100] md:hidden p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-label="Toggle navigation menu"
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay for mobile menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r shadow-md flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Primary Sidebar"
      >
        {/* Top Section: User Info and Navigation */}
        <div>
          {/* User Info */}
          <div className="p-4 border-b flex items-center space-x-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {user?.profilePic ? (
                <Image
                  src={user.profilePic}
                  alt={`${user.name}'s Profile Picture`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="48px"
                  priority={true}
                  unoptimized={true} // Remove if domains are configured in next.config.js correctly
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A9.969 9.969 0 0112 15c2.21 0 4.247.72 5.879 1.923M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                </svg>
              )}
            </div>
            <span className="font-semibold text-lg truncate">{user.name}</span>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul className="p-4 space-y-2">
              {navItems.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded px-3 py-2 ${
                      pathname === href
                        ? "bg-indigo-100 font-semibold text-indigo-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section: Logout button */}
        <div className="p-4 border-t">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded bg-red-100 py-2 px-3 text-center font-semibold text-red-700 hover:bg-red-200"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
