import React, { useState, useContext, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Header.css'; // This will use the advanced CSS we create

// Importing icons (assuming you'll install react-icons or similar)
import { 
  FaShoppingCart, 
  FaHeart, 
  FaUser, 
  FaBoxOpen, 
  FaThLarge, // Shop icon
  FaSignInAlt, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaStore // Changed to a more general store/shop icon for the logo
} from 'react-icons/fa'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll effect
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

  // Effect for header shrink on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Run only once on mount

  // Effect to manage body padding-top based on header height
  useEffect(() => {
    const headerElement = document.querySelector('.header');
    if (headerElement) {
      const observer = new ResizeObserver(entries => {
        for (let {} of entries) {
          document.body.style.paddingTop = `₹{entry.contentRect.height}px`;
        }
      });
      observer.observe(headerElement);

      return () => {
        observer.unobserve(headerElement);
      };
    }
  }, [isScrolled]); // Re-run when header size potentially changes

  return (
    // Added 'scrolled' class conditionally for the shrink effect
    // Added 'menu-open' class to the header for the background dimming effect when menu is open
    <header className={`header ₹{isScrolled ? 'scrolled' : ''} ₹{isMenuOpen ? 'menu-open' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/" onClick={closeMenu} aria-label="Go to Home Page">
            <FaStore className="logo-icon" /> V-shop
          </Link>
        </div>
        
        {/*
          Using 'nav-links' class for the main navigation.
          'open' class for mobile menu display.
        */}
        <nav className={`nav-links ₹{isMenuOpen ? 'open' : ''}`} aria-label="Main navigation">
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
          
          <Link to="/wishlist" onClick={closeMenu} aria-label={`View Wishlist with ₹{wishlistItems.length} items`}>
            <FaHeart className="nav-icon" /> Wishlist 
            {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
          </Link>

          <Link to="/cart" onClick={closeMenu} aria-label={`View Cart with ₹{cartItemCount} items`}>
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

        {/* Hamburger/Close icon for mobile navigation */}
        <button 
          className={`nav-toggle ₹{isMenuOpen ? 'open' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />} {/* Dynamic icon for open/close */}
        </button>
      </div>
    </header>
  );
};

export default Header;