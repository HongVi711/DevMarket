const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middlewares/error.handler');
const app = express();

// Middleware cho phép xử lý dữ liệu dạng JSON
app.set('trust proxy', true);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);

// Error Handler
app.use(errorHandler);

// Export app ra ngoài
module.exports = app;
