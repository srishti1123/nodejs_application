// logger.js
const winston = require('winston');
const path = require('path');

// Set up the logger with Winston
const logger = winston.createLogger({
  level: 'info', // Set the log level (you can change to 'debug', 'error', etc.)
  format: winston.format.json(), // Log in JSON format
  exitOnError: false,
  transports: [
    // Log to a file in the 'logs' directory
    new winston.transports.File({ filename: 'C:\\ProgramData\\Datadog\\node_logs.log' }),
  ],
});

// Example logs
logger.info('Server started');
logger.error('Something went wrong!', { errorDetails: 'Error details go here' });

// You can now use this logger anywhere in your server code
module.exports = logger;
