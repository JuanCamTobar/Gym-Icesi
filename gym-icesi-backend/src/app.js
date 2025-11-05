require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { connectPostgreSQL } = require('./config/db.postgres');
const { syncModels } = require('./models/postgres');
const connectMongoDB = require('./config/db.mongo');
const app = express();

// Connect to databases
connectPostgreSQL();
connectMongoDB();

// Synchronize PostgreSQL models
syncModels();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Logging Middleware
app.use(morgan('dev'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic Route
app.get('/', (req, res) => {
  res.send('Gym Icesi Backend is running!');
});

// Auth Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/trainers', require('./routes/trainer.routes'));
app.use('/routines', require('./routes/routine.routes'));
app.use('/progress', require('./routes/progress.routes'));
app.use('/statistics', require('./routes/statistics.routes'));
app.use('/reports', require('./routes/report.routes'));
app.use('/debug', require('./routes/debug.routes'));

// Error Handling Middleware
app.use(require('./middlewares/error'));

module.exports = app;
