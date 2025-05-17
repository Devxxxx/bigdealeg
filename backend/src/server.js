const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const notificationRoutes = require('./routes/notification.routes');
const protectedRouteRoutes = require('./routes/protectedRoute.routes');
const settingsRoutes = require('./routes/settings.routes');
const savedPropertyRoutes = require('./routes/savedProperty.routes');
const propertyRequestRoutes = require('./routes/propertyRequest.routes');
const scheduledViewingRoutes = require('./routes/scheduledViewing.routes');
const propertyRoutes = require('./routes/property.routes');
const marketRoutes = require('./routes/market.routes');
const salesOpsRoutes = require('./routes/salesOps.routes');
const adminRoutes = require('./routes/admin.routes');
const customerDashboardRoutes = require('./routes/customerDashboard.routes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/protected-route', protectedRouteRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/saved-properties', savedPropertyRoutes);
app.use('/api/property-requests', propertyRequestRoutes);
app.use('/api/scheduled-viewings', scheduledViewingRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/sales-ops', salesOpsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerDashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'ok', timestamp: new Date() });
});

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Adjust the path based on your project structure
  const frontendBuildPath = path.join(__dirname, '../../frontend/out');
  
  // Serve static files
  app.use(express.static(frontendBuildPath));
  
  // Serve the index.html for any non-API routes
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api/')) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: {
          message: 'API endpoint not found'
        }
      });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
  
  console.log(`Serving frontend from ${frontendBuildPath}`);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  
  // Check if HTML is expected in the response
  if (req.accepts('html') && !req.url.startsWith('/api/') && process.env.NODE_ENV === 'production') {
    // For non-API errors in production when HTML is expected, redirect to frontend error page
    return res.redirect('/error');
  }
  
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler - Only apply this for API routes in production
app.use((req, res) => {
  // If in production and not an API route, let the frontend handle the routing
  if (process.env.NODE_ENV === 'production' && !req.url.startsWith('/api/')) {
    return res.status(StatusCodes.OK).sendFile(path.join(__dirname, '../../frontend/out', 'index.html'));
  }
  
  res.status(StatusCodes.NOT_FOUND).json({
    error: {
      message: 'Resource not found'
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes