const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const developerRoutes = require('./routes/developerRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const integrationRoutes = require('./routes/integrationRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const githubAuthRoutes = require("./auth/github.routes");
const onboardingRoutes = require("./routes/onBoardingRoutes");
const uploadRoutes = require("./routes/upload.routes");
// const githubWebhookRoutes = require("./github/webhook.routes"); // dummy for now

const app = express();

// connect DB
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/developer', developerRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/integrations', integrationRoutes);
app.use("/api/auth/github", githubAuthRoutes);
// app.use("/api/github/webhook", githubWebhookRoutes);

app.use("/api/user", onboardingRoutes);
app.use("/api/user", uploadRoutes);


// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// error handler
app.use(errorHandler);

module.exports = app;
