import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // 1. Import useWishlist
import './Header.css';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useWishlist(); // 2. Get wishlist items from the context
  const navigate = useNavigate();
  
  // A simple check for user login state
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  }

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">V-shop</Link>
        </div>
        <nav className="nav-links">
          <Link to="/">Shop</Link>
          {userInfo && <Link to="/orders">My Orders</Link>}
          {userInfo && userInfo.isAdmin && <Link to="/admin">Admin Panel</Link>}
          
          {/* 3. Add Link to Wishlist Page */}
          <Link to="/wishlist">
            Wishlist <span className="cart-badge">{wishlistItems.length}</span>
          </Link>

          <Link to="/cart">
            Cart <span className="cart-badge">{cartItems.reduce((a, c) => a + c.quantity, 0)}</span>
          </Link>
          
          {userInfo ? (
            <button onClick={logoutHandler} className="btn-logout">Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;