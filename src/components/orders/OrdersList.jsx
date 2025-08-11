'use client';

import { useState } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Package,
  MessageSquare,
  Eye,
  MoreVertical,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrdersList({ orders, userRole, onOrderUpdate, onRefresh }) {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': Clock,
      'In Progress': TrendingUp,
      'Delivered': Package,
      'Completed': CheckCircle,
      'Cancelled': XCircle
    };
    return icons[status] || Clock;
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deliveryTime, createdAt) => {
    const created = new Date(createdAt);
    const deadline = new Date(created.getTime() + (deliveryTime * 24 * 60 * 60 * 1000));
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        onOrderUpdate(orderId, { status: newStatus });
        // You could also emit a socket event here for real-time updates
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/orders/${orderId}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        onOrderUpdate(orderId, { status: 'Completed' });
      }
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handleRequestRevision = async (orderId) => {
    const revisionNotes = prompt('Please enter revision notes:');
    if (!revisionNotes) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/orders/${orderId}/revision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ revisionNotes })
      });

      if (response.ok) {
        onOrderUpdate(orderId, { status: 'In Progress' });
      }
    } catch (error) {
      console.error('Error requesting revision:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        onOrderUpdate(orderId, { status: 'Cancelled' });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const openChat = (orderId) => {
    router.push(`/messages?order=${orderId}`);
  };

  const viewOrderDetails = (orderId) => {
    router.push(`/orders/${orderId}`);
  };

  if (orders.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No {userRole === 'freelancer' ? 'orders' : 'purchases'} yet
        </h3>
        <p className="text-muted-foreground mb-4">
          {userRole === 'freelancer' 
            ? 'When clients place orders, they will appear here'
            : 'Start exploring gigs to make your first purchase'
          }
        </p>
        <button
          onClick={() => router.push('/gigs')}
          className="btn btn-primary"
        >
          {userRole === 'freelancer' ? 'Browse Gigs' : 'Explore Gigs'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="card p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Order Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {/* Gig Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  {order.gigId?.gigThumbnail ? (
                    <img 
                      src={order.gigId.gigThumbnail} 
                      alt={order.gigId.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {order.gigId?.title || 'Untitled Gig'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {userRole === 'freelancer' 
                      ? `Client: ${order.buyerId?.name || 'Unknown'}`
                      : `Freelancer: ${order.sellerId?.name || 'Unknown'}`
                    }
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(order.amount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </div>
                    {order.plan?.deliveryTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getDaysRemaining(order.plan.deliveryTime, order.createdAt)} days left
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex flex-col items-end gap-3">
              {/* Status Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {React.createElement(getStatusIcon(order.status), { className: "h-4 w-4" })}
                {order.status}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openChat(order._id)}
                  className="btn btn-outline btn-sm"
                  title="Open Chat"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => viewOrderDetails(order._id)}
                  className="btn btn-outline btn-sm"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>

                {/* Status-specific actions */}
                {userRole === 'freelancer' && order.status === 'Pending' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'In Progress')}
                    className="btn btn-primary btn-sm"
                  >
                    Start Work
                  </button>
                )}

                {userRole === 'freelancer' && order.status === 'In Progress' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                    className="btn btn-primary btn-sm"
                  >
                    Deliver
                  </button>
                )}

                {userRole === 'client' && order.status === 'Delivered' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCompleteOrder(order._id)}
                      className="btn btn-primary btn-sm"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleRequestRevision(order._id)}
                      className="btn btn-outline btn-sm"
                    >
                      Request Revision
                    </button>
                  </div>
                )}

                {(order.status === 'Pending' || order.status === 'In Progress') && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Expanded Order Details */}
          {expandedOrder === order._id && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-medium">{order.plan?.tier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Time:</span>
                      <span className="font-medium">{order.plan?.deliveryTime} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revisions Left:</span>
                      <span className="font-medium">{order.revisionsLeft}</span>
                    </div>
                    {order.requirements && (
                      <div>
                        <span className="text-muted-foreground">Requirements:</span>
                        <p className="text-foreground mt-1">{order.requirements}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Plan Features</h4>
                  <ul className="space-y-1 text-sm">
                    {order.plan?.features?.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {expandedOrder === order._id ? 'Show less' : 'Show more details'}
          </button>
        </div>
      ))}
    </div>
  );
} 