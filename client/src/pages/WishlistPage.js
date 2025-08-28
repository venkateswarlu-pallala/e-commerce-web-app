// src/pages/WishlistPage.js

import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; // 1. Import the advanced ProductCard
import './WishlistPage.css';

const WishlistPage = () => {
  // Logic remains the same, which is great!
  const { wishlistItems } = useWishlist();

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>Your curated collection of favorite items, ready for when you are.</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <p>Your wishlist is empty.</p>
          <Link to="/" className="btn btn-primary">Discover Items</Link>
        </div>
      ) : (
        // 2. Use the same responsive grid as the shop page
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            // 3. Render the ProductCard instead of a custom div.
            // All functionality (add to cart, remove from wishlist) is handled by the card itself.
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;