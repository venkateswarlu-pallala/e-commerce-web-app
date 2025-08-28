import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Header.css';
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaBoxOpen,
  FaThLarge,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaStore
} from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const closeMenu = () => setIsMenuOpen(false);

  const logoutHandler = () => {
    closeMenu();
    localStorage.removeItem('userInfo');
    navigate('/login', { replace: true });
    window.location.reload();
  }

  const cartItemCount = cartItems.reduce((a, c) => a + c.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const headerElement = document.querySelector('.header');
    if (headerElement) {
      const observer = new ResizeObserver(entries => {
        // Corrected line to avoid the '_entry' unused variable warning
        for (let entry of entries) { // Removed underscore from '_entry' if you intend to use 'entry' directly
          document.body.style.paddingTop = `${entry.contentRect.height}px`;
        }
      });
      observer.observe(headerElement);

      return () => {
        observer.unobserve(headerElement);
      };
    }
  }, [isScrolled]);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu} aria-label="Go to Home Page">
            <FaStore className="logo-icon" /> V-shop
          </Link>
        </div>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <Link to="/" onClick={closeMenu} aria-label="Go to Shop">
            <FaThLarge className="nav-icon" /> Shop
          </Link>
          
          {userInfo && (
            <Link to="/orders" onClick={closeMenu} aria-label="View My Orders">
              <FaBoxOpen className="nav-icon" /> My Orders
            </Link>
          )}
          {userInfo && userInfo.isAdmin && (
            <Link to="/admin" onClick={closeMenu} aria-label="Go to Admin Panel">
              <FaUser className="nav-icon" /> Admin
            </Link>
          )}
          
          <Link to="/wishlist" onClick={closeMenu} aria-label={`View Wishlist with ${wishlistItems.length} items`}>
            <FaHeart className="nav-icon" /> Wishlist 
            {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
          </Link>

          <Link to="/cart" onClick={closeMenu} aria-label={`View Cart with ${cartItemCount} items`}>
            <FaShoppingCart className="nav-icon" /> Cart 
            {cartItemCount > 0 && <span className="badge">{cartItemCount}</span>}
          </Link>
          
          {userInfo ? (
            <button onClick={logoutHandler} className="btn btn-secondary nav-btn" aria-label="Logout">
              <FaSignOutAlt className="btn-icon" /> Logout
            </button>
          ) : (
            <Link to="/login" onClick={closeMenu} className="btn btn-primary nav-btn" aria-label="Login">
              <FaSignInAlt className="btn-icon" /> Login
            </Link>
          )}
        </nav>

        <button 
          className={`nav-toggle ${isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Header;