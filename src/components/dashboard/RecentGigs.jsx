'use client';

import Link from 'next/link';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function RecentGigs({ userRole, className = '' }) {
  // Mock data - in real app, fetch from API
  const mockGigs = userRole === 'freelancer' ? [
    {
      id: 1,
      title: 'Website Design for Restaurant',
      client: 'John Doe',
      status: 'active',
      price: 500,
      deadline: '2024-02-15',
      progress: 75
    },
    {
      id: 2,
      title: 'Mobile App Development',
      client: 'Jane Smith',
      status: 'pending',
      price: 1200,
      deadline: '2024-03-01',
      progress: 0
    },
    {
      id: 3,
      title: 'Logo Design Package',
      client: 'Mike Johnson',
      status: 'completed',
      price: 200,
      deadline: '2024-01-30',
      progress: 100
    }
  ] : [
    {
      id: 1,
      title: 'E-commerce Website',
      freelancer: 'Sarah Wilson',
      status: 'active',
      price: 800,
      deadline: '2024-02-20',
      progress: 60
    },
    {
      id: 2,
      title: 'Brand Identity Design',
      freelancer: 'Alex Chen',
      status: 'review',
      price: 350,
      deadline: '2024-02-10',
      progress: 90
    },
    {
      id: 3,
      title: 'Content Writing',
      freelancer: 'David Brown',
      status: 'completed',
      price: 150,
      deadline: '2024-01-25',
      progress: 100
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20', icon: ClockIcon };
      case 'pending':
        return { color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20', icon: ExclamationTriangleIcon };
      case 'review':
        return { color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/20', icon: EyeIcon };
      case 'completed':
        return { color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20', icon: CheckCircleIcon };
      default:
        return { color: 'text-gray-600', bgColor: 'bg-gray-100 dark:bg-gray-900/20', icon: ClockIcon };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'In Progress';
      case 'pending': return 'Pending';
      case 'review': return 'Under Review';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">
          {userRole === 'freelancer' ? 'Recent Orders' : 'My Projects'}
        </h3>
        <Link 
          href={userRole === 'freelancer' ? '/orders' : '/projects'}
          className="text-primary hover:text-primary-dark font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {mockGigs.map((item, index) => {
          const statusInfo = getStatusInfo(item.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div 
              key={item.id}
              className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {userRole === 'freelancer' ? `Client: ${item.client}` : `Freelancer: ${item.freelancer}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                    <div className="flex items-center gap-1">
                      <StatusIcon className="w-3 h-3" />
                      {getStatusText(item.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-foreground font-medium">
                    ${item.price}
                  </span>
                  <span className="text-muted-foreground">
                    Due: {new Date(item.deadline).toLocaleDateString()}
                  </span>
                </div>
                
                {item.status === 'active' && (
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {item.progress}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {mockGigs.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No {userRole === 'freelancer' ? 'orders' : 'projects'} yet.</p>
          {userRole === 'freelancer' ? (
            <Link href="/gigs" className="text-primary hover:underline mt-2 inline-block">
              Browse available gigs
            </Link>
          ) : (
            <Link href="/gigs" className="text-primary hover:underline mt-2 inline-block">
              Start your first project
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 