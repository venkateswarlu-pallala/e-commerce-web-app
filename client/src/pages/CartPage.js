import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import './CartPage.css'; // We will update this file

const CartPage = () => {
    // Note: We don't need clearCart here anymore, as it happens after a successful checkout.
    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const totalAmount = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

    // This handler's only job is to move the user to the checkout page.
    const checkoutHandler = () => {
        // You could add a check here to redirect to login if the user is not authenticated
        navigate('/checkout');
    };

    return (
        
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn btn-primary">Go Shopping</Link>
                </div>
            ) : (
                <div className="cart-container">
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="cart-item-image"/>
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <button onClick={() => removeFromCart(item._id)} aria-label="Remove one item">-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} aria-label="Add one item">+</button>
                                </div>
                                <div className="cart-item-subtotal">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <button
    onClick={checkoutHandler}
    // Use the global button classes for a consistent, advanced look
    className="btn btn-primary btn-glow"
    disabled={cartItems.length === 0}
>
    Proceed to Checkout
</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;