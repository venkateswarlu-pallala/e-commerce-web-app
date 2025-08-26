import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Providers
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Import Pages and Components
import HomePage from './pages/HomePage';
import WishlistPage from './pages/WishlistPage'; // This is already imported, which is great!
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <WishlistProvider>
          <Header />
          <main className="container">
            <Routes>
              {/* All your pages can now also access the cart and wishlist contexts */}
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin" element={<AdminPage />} />
              
              {/* --- ADD THIS LINE --- */}
              <Route path="/wishlist" element={<WishlistPage />} />
              
            </Routes>
          </main>
        </WishlistProvider>
      </CartProvider>
    </Router>
  );
}

export default App;