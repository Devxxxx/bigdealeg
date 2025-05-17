module.exports = {
  // Performance monitoring and optimization configurations
  performance: {
    // Disable automatic prefetching which can cause unnecessary network load
    prefetch: false,
    
    // Maximum concurrent requests
    maxConcurrentRequests: 5,
    
    // Timeout for network requests
    requestTimeout: 10000, // 10 seconds
  },
  
  // WebSocket configuration
  websocket: {
    // Reconnection attempts
    reconnectAttempts: 3,
    
    // Reconnection delay
    reconnectDelay: 1000, // 1 second
  }
};