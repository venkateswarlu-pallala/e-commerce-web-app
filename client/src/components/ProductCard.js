import React, { useContext } from 'react';
import CartContext from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css'; // We will create this CSS file

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
      <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} className="product-image" />
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <span className="price">${product.price.toFixed(2)}</span>
          <div className="product-actions">
            <button
              onClick={handleWishlistToggle}
              className={`btn-wishlist ${inWishlist ? 'in-wishlist' : ''}`}
              aria-label="Toggle Wishlist"
            >
              {inWishlist ? '❤️' : '🤍'}
            </button>
            <button onClick={() => addToCart(product)} className="add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;