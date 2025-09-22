const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes and config
const votingRoutes = require('./routes/voting');
const CONTRACT_CONFIG = require('./config/contract');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
};

// Routes
app.use('/api', votingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    contractAddress: CONTRACT_CONFIG.address
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Voting backend server running on port ${PORT}`);
  console.log(`📋 Contract address: ${CONTRACT_CONFIG.address}`);
  console.log(`👤 Owner account: ${CONTRACT_CONFIG.ownerAccount}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
});

module.exports = app;
