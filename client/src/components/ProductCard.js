// src/components/ProductCard.js

import React, { useContext, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

// Using React.memo to prevent re-renders if the product prop doesn't change.
// This is a major performance win for pages with many products.
const ProductCard = React.memo(({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();

  // Destructure product properties for cleaner JSX
  const { _id, name, description, price, imageUrl } = product;

  const inWishlist = isItemInWishlist(_id);

  // Memoize callback functions to ensure they are stable between renders,
  // which is crucial for React.memo to work correctly.
  const handleWishlistToggle = useCallback(() => {
    if (inWishlist) {
      removeFromWishlist(_id);
    } else {
      addToWishlist(product);
    }
  }, [inWishlist, removeFromWishlist, addToWishlist, product, _id]);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
  }, [addToCart, product]);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {/* Wrap the image in a Link to the product details page */}
        <Link to={`/product/${_id}`}>
          <img src={imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'} alt={name} className="product-image" />
        </Link>
        {/* Wishlist button is now an overlay on the image for a cleaner look */}
        <button
          onClick={handleWishlistToggle}
          className={`btn-wishlist ${inWishlist ? 'in-wishlist' : ''}`}
          aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"} // Dynamic aria-label
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"></path></svg>
        </button>
      </div>
      <div className="product-details">
        {/* Wrap title in a Link as well */}
        <Link to={`/product/${_id}`} className="product-title-link">
          <h3 className="product-title">{name}</h3>
        </Link>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">₹{price.toFixed(2)}</span>
          <button onClick={handleAddToCart} className="btn add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;