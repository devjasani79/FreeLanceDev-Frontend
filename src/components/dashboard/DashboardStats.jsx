'use client';

import { 
  BriefcaseIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ShoppingCartIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

export default function DashboardStats({ stats, userRole, className = '' }) {
  if (!stats) return null;

  const freelancerStats = [
    {
      title: 'Total Gigs',
      value: stats.totalGigs,
      icon: BriefcaseIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: '+2 this month'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      change: '3 in progress'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: '+$450 this month'
    },
    {
      title: 'Completed',
      value: stats.completedProjects,
      icon: CheckCircleIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: '28 total'
    }
  ];

  const clientStats = [
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: ClockIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: '5 in progress'
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: '$800 this month'
    },
    {
      title: 'Completed',
      value: stats.completedProjects,
      icon: CheckCircleIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: '12 total'
    },
    {
      title: 'Saved Gigs',
      value: stats.savedGigs,
      icon: BookmarkIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      change: '8 bookmarked'
    }
  ];

  const currentStats = userRole === 'freelancer' ? freelancerStats : clientStats;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {currentStats.map((stat, index) => (
        <div 
          key={stat.title}
          className="card hover-lift group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 