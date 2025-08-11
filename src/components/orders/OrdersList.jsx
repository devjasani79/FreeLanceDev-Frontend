'use client';

import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function OrdersList({ orders, userRole }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return { 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-100 dark:bg-blue-900/20', 
          icon: ClockIcon,
          text: 'In Progress'
        };
      case 'pending':
        return { 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20', 
          icon: ExclamationTriangleIcon,
          text: 'Pending'
        };
      case 'review':
        return { 
          color: 'text-purple-600', 
          bgColor: 'bg-purple-100 dark:bg-purple-900/20', 
          icon: EyeIcon,
          text: 'Under Review'
        };
      case 'completed':
        return { 
          color: 'text-green-600', 
          bgColor: 'bg-green-100 dark:bg-green-900/20', 
          icon: CheckCircleIcon,
          text: 'Completed'
        };
      default:
        return { 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100 dark:bg-gray-900/20', 
          icon: ClockIcon,
          text: status
        };
    }
  };

  if (orders.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-muted-foreground mb-4">
          <ClockIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            No {userRole === 'freelancer' ? 'orders' : 'projects'} yet
          </h3>
          <p className="text-muted-foreground mb-6">
            {userRole === 'freelancer' 
              ? 'You haven\'t received any work requests yet. Keep your profile updated to attract clients.'
              : 'You haven\'t started any projects yet. Browse our gigs to find the perfect freelancer.'
            }
          </p>
          {userRole === 'freelancer' ? (
            <Link href="/gigs" className="btn btn-primary">
              Browse Available Gigs
            </Link>
          ) : (
            <Link href="/gigs" className="btn btn-primary">
              Start Your First Project
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => {
        const statusInfo = getStatusInfo(order.status);
        const StatusIcon = statusInfo.icon;
        
        return (
          <div 
            key={order.id}
            className="card hover-lift group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Main Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {order.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        <span>
                          {userRole === 'freelancer' ? `Client: ${order.client}` : `Freelancer: ${order.freelancer}`}
                        </span>
                      </div>
                      <span>${order.price}</span>
                      <span>Due: {new Date(order.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
                    <div className="flex items-center gap-1">
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.text}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {order.status === 'active' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{order.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 lg:flex-col lg:items-stretch">
                <Link
                  href={`/orders/${order.id}`}
                  className="btn btn-outline text-sm"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  View Details
                </Link>
                
                <button className="btn btn-primary text-sm">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  Message
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 