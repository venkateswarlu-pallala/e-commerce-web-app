// server.js (or app.js)

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Assuming you have a DB connection file
const userRoutes = require('./routes/authroutes'); // Assuming authroutes.js
const orderRoutes = require('./routes/orderRoutes'); // Assuming orderRoutes.js
const shopRoutes = require('./routes/shopRoutes'); // <--- THIS IS THE KEY IMPORT
const cors = require('cors');
dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();

const allowedOrigins = [
  'http://localhost:3000',                 // Local React dev
  'https://v-shop-website.netlify.app'          // Your Netlify deployed site
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
  credentials: true, // Allow cookies to be sent
}));

// API Routes
app.use('/api/users', userRoutes); // For /api/users/register and /api/users/login
app.use('/api/orders', orderRoutes); // For /api/orders and /api/orders/myorders
app.use('/api/shop', shopRoutes); // <--- THIS IS THE KEY LINE FOR YOUR SHOP ROUTES

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Add a basic error handling middleware (optional but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});