// Environment Configuration
// This file centralizes all environment variables and their fallbacks

export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://freelancedevserver.onrender.com/api',
  websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000',
  
  // Socket.io Configuration
  socketUrl: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://freelancedevserver.onrender.com',
  
  // Environment Detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Feature Flags
  features: {
    realTimeChat: true,
    fileUploads: true,
    notifications: true,
    analytics: false
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint = '') => {
  return `${config.apiUrl}${endpoint}`;
};

// Helper function to get Socket.io URL
export const getSocketUrl = () => {
  return config.socketUrl;
};

export default config; 