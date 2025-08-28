import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import api from '../services/api'; // Your configured axios instance
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

        try {
      const { data: createdOrder } = await api.post('/orders', { // Destructure data as createdOrder
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: 'Dummy Payment',
        itemsPrice: totalPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice
      });
      clearCart();
      // Redirect to a success page showing the new order's ID
      navigate(`/order-success/${createdOrder._id}`); // Correct template literal usage

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <form onSubmit={submitHandler} className="checkout-form">
        <div className="form-section">
          <h2>Shipping Address</h2>
          <input name="address" type="text" placeholder="Address" onChange={handleAddressChange} required />
          <input name="city" type="text" placeholder="City" onChange={handleAddressChange} required />
          <input name="postalCode" type="text" placeholder="Postal Code" onChange={handleAddressChange} required />
          <input name="country" type="text" placeholder="Country" onChange={handleAddressChange} required />
        </div>
        
        <div className="form-section">
          <h2>Payment Method</h2>
          <div className="dummy-payment">
            <p>✓ Dummy Payment Method (For Testing)</p>
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <p>Total: <strong>₹{totalPrice.toFixed(2)}</strong></p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={loading} className="btn-confirm-order">
          {loading ? 'Placing Order...' : 'Confirm and Place Order'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;