// src/components/ProductCard.js

import React, { useContext } from 'react';
import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css'; // The new CSS will apply to this structure

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();

  const inWishlist = isItemInWishlist(product._id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} className="product-image" />
      </div>
      <div className="product-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price.toFixed(2)}</span>
          
          {/* --- NEW ACTION BAR STRUCTURE --- */}
          <div className="product-actions">
            <button
              onClick={handleWishlistToggle}
              className={`btn-wishlist ₹{inWishlist ? 'in-wishlist' : ''}`}
              aria-label="Toggle Wishlist"
            >
              {/* Using a cleaner heart icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"></path></svg>
            </button>
            <button onClick={() => addToCart(product)} className="btn btn-primary add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;