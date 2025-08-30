// server.js (or app.js)

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/authroutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require('./routes/shopRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

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

// --- ADD THIS LINE HERE! ---
// This middleware is essential for parsing JSON request bodies.
// It MUST come before your routes that expect JSON in req.body.
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shop', shopRoutes);

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