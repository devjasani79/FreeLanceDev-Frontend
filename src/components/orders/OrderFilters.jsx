'use client';

import { Search, Filter, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function OrderFilters({ filters, onFilterChange, userRole }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Last Year' }
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      search: '',
      dateRange: 'all'
    });
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.search !== '' || 
                          filters.dateRange !== 'all';

  return (
    <div className="card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${userRole === 'freelancer' ? 'orders' : 'projects'}...`}
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleInputChange('dateRange', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {dateRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex items-end">
              <div className="flex flex-wrap gap-2">
                {filters.status !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    Status: {filters.status}
                    <button
                      onClick={() => handleInputChange('status', 'all')}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.dateRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {filters.dateRange === '7' ? 'Last 7 Days' : 
                     filters.dateRange === '30' ? 'Last 30 Days' :
                     filters.dateRange === '90' ? 'Last 90 Days' :
                     filters.dateRange === '365' ? 'Last Year' : ''}
                    <button
                      onClick={() => handleInputChange('dateRange', 'all')}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 