// Import and initialize the Datadog tracer at the very beginning
const tracer = require('dd-trace').init({
  tags: {
    'git.commit.sha': process.env.DD_GIT_COMMIT_SHA || 'unknown-sha',
    'git.repository.url': process.env.DD_GIT_REPOSITORY_URL || 'unknown-url'
  }
});
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

// Configure environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory array to store users temporarily
const users = [];

// Middleware to log incoming requests with trace ID
app.use((req, res, next) => {
  const traceId = tracer.scope().active() ? tracer.scope().active().context().toString() : 'no-trace-id';
  logger.info('Received request', { method: req.method, url: req.url, traceId });
  next();
});

// Route to get all users
app.get("/api/users", (req, res) => {
  res.json({ users });
});

// Route to add a new user
app.post("/api/user", (req, res) => {
  const { username, email } = req.body;

  if (username && email) {
    users.push({ username, email });
    logger.info('User added successfully', { username});
    logger.info('user email added successfully',{email})
    res.json({ message: "User added successfully" });
  } else {
    res.status(400).json({ message: "Username and email are required" });
  }
});

app.get("/api/error", (req, res) => {
  // Simulate an error to trigger the error handler
  throw new Error("Something went wrong in /api/error!");
});

// Error handling middleware (catch unhandled errors)
app.use((err, req, res, next) => {
  logger.error('Unhandled error occurred', { error: err.message, stack: err.stack });
  res.status(500).send('Something went wrong!');
});

// Start the server and log the event
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});
