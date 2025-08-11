'use client';

import { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function GigManagementList({ gigs, onDelete, onEdit }) {
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedGigs = [...gigs].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const filteredGigs = sortedGigs.filter(gig =>
    gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gig.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusIcon = (gig) => {
    // This would be based on actual gig status from your backend
    // For now, we'll show a default status
    return <ClockIcon className="w-4 h-4 text-blue-500" />;
  };

  const getStatusText = (gig) => {
    // This would be based on actual gig status from your backend
    return 'Active';
  };

  if (gigs.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-muted-foreground mb-4">
          <EyeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-foreground mb-2">No gigs yet</h3>
          <p className="text-muted-foreground mb-6">
            Start creating gigs to showcase your services and attract clients
          </p>
          <Link href="/gigs/create" className="btn btn-primary">
            Create Your First Gig
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search gigs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input max-w-xs"
          >
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn btn-outline px-3"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Gigs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-700">
              <th className="text-left py-3 px-4 font-medium text-foreground">Gig</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Category</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Price Range</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Created</th>
              <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGigs.map((gig, index) => (
              <tr 
                key={gig._id} 
                className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                      {gig.gigThumbnail ? (
                        <img 
                          src={gig.gigThumbnail} 
                          alt={gig.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground line-clamp-2">
                        {gig.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {gig.desc.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize">
                    {gig.category}
                  </span>
                </td>
                
                <td className="py-4 px-4">
                  {gig.pricePlans && gig.pricePlans.length > 0 ? (
                    <div className="text-sm">
                      <span className="text-foreground font-medium">
                        ${Math.min(...gig.pricePlans.map(p => p.price))}
                      </span>
                      <span className="text-muted-foreground"> - </span>
                      <span className="text-foreground font-medium">
                        ${Math.max(...gig.pricePlans.map(p => p.price))}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">No pricing</span>
                  )}
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(gig)}
                    <span className="text-sm text-foreground">
                      {getStatusText(gig)}
                    </span>
                  </div>
                </td>
                
                <td className="py-4 px-4">
                  <span className="text-sm text-muted-foreground">
                    {new Date(gig.createdAt).toLocaleDateString()}
                  </span>
                </td>
                
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/gigs/${gig._id}`}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="View Gig"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onEdit(gig._id)}
                      className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Gig"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(gig._id)}
                      className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Gig"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results Count */}
      <div className="mt-6 text-sm text-muted-foreground">
        Showing {filteredGigs.length} of {gigs.length} gigs
      </div>
    </div>
  );
} 