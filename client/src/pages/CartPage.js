import React, { useContext } from 'react';
import CartContext from '../context/CartContext';
import api from '../services/api';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, addToCart, removeFromCart, clearCart } = useContext(CartContext);

    const totalAmount = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);

    const placeOrderHandler = async () => {
        const orderItems = cartItems.map(item => ({
            ShopItem: item._id,
            quantity: item.quantity
        }));

        const order = {
            items: orderItems,
            totalAmount: totalAmount
        };

        try {
            await api.post('/orders', order);
            alert('Order placed successfully!');
            clearCart();
        } catch (error) {
            alert('Failed to place order. Please make sure you are logged in.');
            console.error(error);
        }
    };

    return (
        <div className="cart-page">
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-container">
                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} />
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p>${item.price.toFixed(2)}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <button onClick={() => removeFromCart(item._id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => addToCart(item)}>+</button>
                                </div>
                                <div className="cart-item-subtotal">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <p>Total: <span>${totalAmount.toFixed(2)}</span></p>
                        <button onClick={placeOrderHandler} disabled={cartItems.length === 0}>
                            Place Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;