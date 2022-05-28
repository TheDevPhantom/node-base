import path from 'path';
import express, { json } from 'express';
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

import db from './config/db.js';
import { config } from 'dotenv';

import auth from './routes/auth.js';
import users from './routes/users.js';

import errorHandler from './middleware/error.js';

const __dirname = path.resolve();

// Load environment variables base on the environment set by npm
config({ path: `./config/${process.env.NODE_ENV}.env` });

// Authenticate the database
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log('Error: ' + err));

// Create a new server instance on start
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
//                MIDDLEWARE
// ========================================
app.use(json());

// ========================================
//                  ROUTES
// ========================================
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

// Catches all uncaught errors
app.use(errorHandler);

// Sync the database and if successful start the server
// else log error to the console
db.sync()
  .then((result) => {
    const port = process.env.port || 5000;

    const server = app.listen(port, () =>
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${port}`
      )
    );
  })
  .catch((err) => console.log(err));

export default app;
