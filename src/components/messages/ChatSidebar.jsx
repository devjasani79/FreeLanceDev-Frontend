'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Package,
  XCircle,
  Search
} from 'lucide-react';

export default function ChatSidebar({ conversations, selectedOrder, onConversationSelect, userRole }) {
  const [searchTerm, setSearchTerm] = useState('');

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
      'Pending': 'text-yellow-600',
      'In Progress': 'text-blue-600',
      'Delivered': 'text-purple-600',
      'Completed': 'text-green-600',
      'Cancelled': 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchTerm.toLowerCase();
    return (
      conv.order?.gigId?.title?.toLowerCase().includes(searchLower) ||
      (userRole === 'freelancer' 
        ? conv.order?.buyerId?.name?.toLowerCase().includes(searchLower)
        : conv.order?.sellerId?.name?.toLowerCase().includes(searchLower)
      )
    );
  });

  if (conversations.length === 0) {
    return (
      <div className="card h-full p-6">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No conversations yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Start a project to begin messaging with {userRole === 'freelancer' ? 'clients' : 'freelancers'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full p-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Conversations ({conversations.length})
        </h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const isSelected = selectedOrder?.orderId === conversation.orderId;
          const StatusIcon = getStatusIcon(conversation.order?.status);
          const statusColor = getStatusColor(conversation.order?.status);
          
          return (
            <div
              key={conversation.orderId}
              onClick={() => onConversationSelect(conversation)}
              className={`p-4 border-b border-border cursor-pointer transition-colors hover:bg-accent/50 ${
                isSelected ? 'bg-accent border-l-4 border-l-primary' : ''
              }`}
            >
              {/* Order Info */}
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  {userRole === 'freelancer' 
                    ? conversation.order?.buyerId?.profilePic 
                    : conversation.order?.sellerId?.profilePic
                  ? (
                    <img 
                      src={userRole === 'freelancer' 
                        ? conversation.order.buyerId.profilePic 
                        : conversation.order.sellerId.profilePic
                      } 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-500">
                        {userRole === 'freelancer' 
                          ? conversation.order?.buyerId?.name?.charAt(0)?.toUpperCase()
                          : conversation.order?.sellerId?.name?.charAt(0)?.toUpperCase()
                        }
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground text-sm truncate">
                      {userRole === 'freelancer' 
                        ? conversation.order?.buyerId?.name || 'Unknown Client'
                        : conversation.order?.sellerId?.name || 'Unknown Freelancer'
                      }
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessage && formatDate(conversation.lastMessage.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 truncate">
                    {conversation.order?.gigId?.title || 'Untitled Gig'}
                  </p>

                  {/* Status and Last Message */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-3 w-3 ${statusColor}`} />
                      <span className="text-xs text-muted-foreground">
                        {conversation.order?.status}
                      </span>
                    </div>
                    
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Last Message Preview */}
              {conversation.lastMessage && (
                <div className="ml-13">
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.sender._id === conversation.order?.buyerId?._id 
                      ? 'Client: ' 
                      : 'You: '
                    }
                    {truncateText(conversation.lastMessage.content)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 