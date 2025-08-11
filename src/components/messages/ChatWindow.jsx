'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon,
  File,
  Clock,
  CheckCircle,
  TrendingUp,
  Package,
  XCircle
} from 'lucide-react';

export default function ChatWindow({ order, messages, onSendMessage, user, isConnected }) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = () => {
    if (messageText.trim() && !isTyping) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload the file to your server/cloud storage
      // For now, we'll just send the filename
      onSendMessage(`File: ${file.name}`, 'file', file.name);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // In a real app, you'd upload the image to your server/cloud storage
      // For now, we'll just send the filename
      onSendMessage(`Image: ${file.name}`, 'image', file.name);
    }
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.sender._id === user.id;
    const StatusIcon = getStatusIcon(order.order.status);
    const statusColor = getStatusColor(order.order.status);

    return (
      <div
        key={message._id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
          {/* Avatar */}
          <div className={`flex items-end gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              {message.sender.profilePic ? (
                <img 
                  src={message.sender.profilePic} 
                  alt={message.sender.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">
                    {message.sender.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`px-4 py-2 rounded-lg ${
                isOwnMessage
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {message.messageType === 'file' && (
                <div className="flex items-center gap-2 mb-2">
                  <File className="h-4 w-4" />
                  <span className="text-sm font-medium">File Attachment</span>
                </div>
              )}
              
              {message.messageType === 'image' && (
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Image</span>
                </div>
              )}

              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              <div className={`flex items-center justify-between mt-2 text-xs ${
                isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                <span>{formatTime(message.createdAt)}</span>
                {isOwnMessage && (
                  <span className="flex items-center gap-1">
                    {message.isRead ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card h-full p-0 overflow-hidden flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Gig Thumbnail */}
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              {order.order.gigId?.gigThumbnail ? (
                <img 
                  src={order.order.gigId.gigThumbnail} 
                  alt={order.order.gigId.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-500">Gig</span>
                </div>
              )}
            </div>

            {/* Order Info */}
            <div>
              <h3 className="font-semibold text-foreground">
                {order.order.gigId?.title || 'Untitled Gig'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {user.role === 'freelancer' 
                    ? `Client: ${order.order.buyerId?.name || 'Unknown'}`
                    : `Freelancer: ${order.order.sellerId?.name || 'Unknown'}`
                  }
                </span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <StatusIcon className={`h-3 w-3 ${statusColor}`} />
                  <span>{order.order.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
            isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {isConnected ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Start the conversation
            </h3>
            <p className="text-muted-foreground">
              Send the first message to begin discussing your project
            </p>
          </div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-end gap-2">
          {/* File Upload Buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <button
              onClick={() => document.getElementById('imageInput')?.click()}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Attach image"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <input
            id="imageInput"
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              rows={1}
              disabled={!isConnected}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected || isTyping}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="mt-2 text-sm text-muted-foreground">
            {user.role === 'freelancer' 
              ? order.order.buyerId?.name || 'Client'
              : order.order.sellerId?.name || 'Freelancer'
            } is typing...
          </div>
        )}
      </div>
    </div>
  );
} 