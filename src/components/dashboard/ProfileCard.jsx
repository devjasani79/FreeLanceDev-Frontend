'use client';

import { useState } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  BriefcaseIcon, 
  StarIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ProfileCard({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Profile</h3>
        <Link 
          href="/profile/settings"
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="relative">
            {user.profilePic ? (
              <img 
                src={user.profilePic} 
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-neutral-700"></div>
          </div>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h4 className="text-xl font-semibold text-foreground mb-1">
            {user.name}
          </h4>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <BriefcaseIcon className="w-4 h-4" />
            <span className="capitalize">{user.role}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="text-center">
            <div className="flex items-center gap-1 text-yellow-500">
              <StarIcon className="w-4 h-4 fill-current" />
              <span className="font-semibold">{user.rating || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          {user.role === 'freelancer' && (
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {user.skills?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Skills</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Link 
            href="/profile/settings"
            className="w-full btn btn-outline text-sm"
          >
            Edit Profile
          </Link>
          {user.role === 'freelancer' && (
            <Link 
              href="/gigs/create"
              className="w-full btn btn-primary text-sm"
            >
              Create New Gig
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 