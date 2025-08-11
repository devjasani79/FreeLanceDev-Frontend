'use client';

import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from 'next-themes';
import { 
  MoonIcon, 
  SunIcon, 
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight gradient-text hover:scale-105 transition-transform">
          FreelanceDev
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/gigs" 
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Browse Gigs
          </Link>
          
          {user && user.role === 'freelancer' && (
            <Link 
              href="/gigs/create" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Create Gig
            </Link>
          )}
          
          {user && (
            <Link 
              href="/dashboard" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-neutral-600" />
              )}
            </button>
          )}

          {/* Auth Buttons / User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-foreground font-medium">
                  {user.name}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 animate-scale-in">
                  <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  
                  <Link
                    href="/profile/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <UserCircleIcon className="w-4 h-4 mr-3" />
                    Profile Settings
                  </Link>
                  
                  {user.role === 'freelancer' && (
                    <Link
                      href="/gigs/manage"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <CogIcon className="w-4 h-4 mr-3" />
                      Manage Gigs
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                href="/auth/login" 
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="btn btn-primary text-sm"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden px-6 pb-3">
        <div className="flex items-center space-x-4">
          <Link 
            href="/gigs" 
            className="text-foreground hover:text-primary transition-colors text-sm"
          >
            Browse Gigs
          </Link>
          {user && user.role === 'freelancer' && (
            <Link 
              href="/gigs/create" 
              className="text-foreground hover:text-primary transition-colors text-sm"
            >
              Create Gig
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
