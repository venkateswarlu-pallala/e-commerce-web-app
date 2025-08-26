import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import './WishlistPage.css'; // Create this CSS file for styling

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="wishlist-container">
      <h1>My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty. <Link to="/">Go Shopping</Link></p>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>${item.price}</p>
                <button onClick={() => removeFromWishlist(item._id)} className="btn-remove">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;