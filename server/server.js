const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Allowed origins
const allowedOrigins = [
  'http://localhost:3000',                 // Local React dev
  'http://v-shop-website.netlify.app'          // Your Netlify deployed site
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Define Routes
app.use('/api/users', require('./routes/authroutes'));
app.use('/api/shop', require('./routes/shopRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
