'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import ChatSidebar from '@/components/messages/ChatSidebar';
import ChatWindow from '@/components/messages/ChatWindow';
import LoadingSpinner from '@/components/ui/Spinner';
import { io } from 'socket.io-client';

export default function MessagesPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  
  const [conversations, setConversations] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      initializeSocket();
      fetchConversations();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user, loading, router]);

  useEffect(() => {
    if (orderId && conversations.length > 0) {
      const order = conversations.find(conv => conv.orderId === orderId);
      if (order) {
        setSelectedOrder(order);
        fetchMessages(orderId);
      }
    }
  }, [orderId, conversations]);

  const initializeSocket = () => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://freelancedevserver.onrender.com', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to chat server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from chat server');
    });

    newSocket.on('message-received', (data) => {
      if (selectedOrder && data.orderId === selectedOrder.orderId) {
        setMessages(prev => [...prev, data.message]);
      }
      // Update conversation list with new message
      updateConversationWithMessage(data);
    });

    newSocket.on('status-updated', (data) => {
      // Handle order status updates
      console.log('Order status updated:', data);
    });

    setSocket(newSocket);
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        
        // If no order is selected, select the first conversation
        if (!selectedOrder && data.conversations.length > 0) {
          setSelectedOrder(data.conversations[0]);
          fetchMessages(data.conversations[0].orderId);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (orderId) => {
    if (!orderId) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/messages/conversation/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        
        // Join the order room for real-time updates
        if (socket) {
          socket.emit('join-order', orderId);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const updateConversationWithMessage = (data) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.orderId === data.orderId 
          ? { ...conv, lastMessage: data.message }
          : conv
      )
    );
  };

  const handleSendMessage = async (content, messageType = 'text', fileUrl = null) => {
    if (!selectedOrder || !content.trim()) return;

    try {
      const messageData = {
        orderId: selectedOrder.orderId,
        receiverId: user.role === 'freelancer' 
          ? selectedOrder.order.buyerId._id 
          : selectedOrder.order.sellerId._id,
        content: content.trim(),
        messageType,
        fileUrl
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api'}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const data = await response.json();
        const newMessage = data.message;
        
        // Add message to local state
        setMessages(prev => [...prev, newMessage]);
        
        // Update conversation list
        updateConversationWithMessage({
          orderId: selectedOrder.orderId,
          message: newMessage
        });

        // Emit socket event for real-time delivery
        if (socket) {
          socket.emit('new-message', {
            orderId: selectedOrder.orderId,
            message: newMessage
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedOrder(conversation);
    fetchMessages(conversation.orderId);
    
    // Leave previous room and join new one
    if (socket) {
      if (selectedOrder) {
        socket.emit('leave-order', selectedOrder.orderId);
      }
      socket.emit('join-order', conversation.orderId);
    }
  };

  if (loading || isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <Container>
        {/* Header */}
        <div className="py-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Messages
          </h1>
          <p className="text-muted-foreground text-lg">
            Communicate with your {user.role === 'freelancer' ? 'clients' : 'freelancers'} about your projects
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ChatSidebar
              conversations={conversations}
              selectedOrder={selectedOrder}
              onConversationSelect={handleConversationSelect}
              userRole={user.role}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            {selectedOrder ? (
              <ChatWindow
                order={selectedOrder}
                messages={messages}
                onSendMessage={handleSendMessage}
                user={user}
                isConnected={isConnected}
              />
            ) : (
              <div className="card h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
} 