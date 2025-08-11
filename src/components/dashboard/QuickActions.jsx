'use client';

import Link from 'next/link';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  CogIcon, 
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export default function QuickActions({ userRole }) {
  const freelancerActions = [
    {
      title: 'Create New Gig',
      description: 'Start offering your services',
      icon: PlusIcon,
      href: '/gigs/create',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Manage Gigs',
      description: 'Edit and update your services',
      icon: BriefcaseIcon,
      href: '/gigs/manage',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'View Orders',
      description: 'Check incoming requests',
      icon: DocumentTextIcon,
      href: '/orders',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Messages',
      description: 'Chat with clients',
      icon: ChatBubbleLeftRightIcon,
      href: '/messages',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  const clientActions = [
    {
      title: 'Browse Gigs',
      description: 'Find the perfect service',
      icon: MagnifyingGlassIcon,
      href: '/gigs',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'My Orders',
      description: 'Track your projects',
      icon: DocumentTextIcon,
      href: '/orders',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Saved Gigs',
      description: 'Your bookmarked services',
      icon: HeartIcon,
      href: '/gigs/saved',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      title: 'Messages',
      description: 'Chat with freelancers',
      icon: ChatBubbleLeftRightIcon,
      href: '/messages',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  const commonActions = [
    {
      title: 'Profile Settings',
      description: 'Update your information',
      icon: CogIcon,
      href: '/profile/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-900/20'
    }
  ];

  const currentActions = userRole === 'freelancer' 
    ? [...freelancerActions, ...commonActions]
    : [...clientActions, ...commonActions];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {currentActions.map((action, index) => (
          <Link
            key={action.title}
            href={action.href}
            className="block p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 