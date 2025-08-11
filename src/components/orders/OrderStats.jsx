'use client';

import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp 
} from 'lucide-react';

export default function OrderStats({ stats, userRole }) {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Delivered': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': Clock,
      'In Progress': TrendingUp,
      'Delivered': CheckCircle,
      'Completed': CheckCircle,
      'Cancelled': XCircle
    };
    return icons[status] || Clock;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statusOrder = ['Pending', 'In Progress', 'Delivered', 'Completed', 'Cancelled'];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total {userRole === 'freelancer' ? 'Orders' : 'Purchases'}
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total {userRole === 'freelancer' ? 'Earnings' : 'Spent'}
              </p>
              <p className="text-3xl font-bold text-foreground">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active {userRole === 'freelancer' ? 'Orders' : 'Projects'}
              </p>
              <p className="text-3xl font-bold text-foreground">
                {(stats.byStatus['Pending']?.count || 0) + 
                (stats.byStatus['In Progress']?.count || 0) + 
                (stats.byStatus['Delivered']?.count || 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completed
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats.byStatus['Completed']?.count || 0}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Status Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statusOrder.map(status => {
            const statusData = stats.byStatus[status];
            if (!statusData) return null;
            
            const Icon = getStatusIcon(status);
            const percentage = stats.totalOrders > 0 
              ? Math.round((statusData.count / stats.totalOrders) * 100) 
              : 0;

            return (
              <div key={status} className="card p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{status}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {statusData.count}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage}% of total
                    </p>
                  </div>
                </div>
                {statusData.amount > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formatCurrency(statusData.amount)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
