const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const mongoose = require('./connection'); // Use existing connection
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const publicProductRoutes = require('./routes/publicProductRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Database connection is already established in connection.js

const app = express();
const PORT = process.env.PORT || 10000; // Render will set the PORT env variable

// Middleware
app.use(cors({
  origin: [
    'https://tiffin-5-b0sgj48jj-shuklalakshya-devs-projects.vercel.app',
    'http://localhost:3000',
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true
}))
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/products', publicProductRoutes);
app.use('/api/admin/orders', orderRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: ${baseUrl}`);
});