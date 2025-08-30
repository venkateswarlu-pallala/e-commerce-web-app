import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './OrdersPage.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null); // State to track the open accordion

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('api/orders/myorders');
                setOrders(data);
                // Automatically expand the most recent order by default
                if (data.length > 0) {
                    setExpandedOrderId(data[0]._id);
                }
            } catch (error) {
                console.error('Could not fetch orders', error);
                setError('Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);
    
    // Function to toggle which order is expanded
    const toggleOrder = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    if (loading) {
        return <div className="loading-spinner">Loading your orders...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="orders-page">
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You have no past orders.</p>
                    <Link to="/" className="btn btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => {
                        return (
                            // Add dynamic class based on expanded state
                            <div key={order._id} className={`order-card ₹{isExpanded ? 'expanded' : ''}`}>
                                <div className="order-header" onClick={() => toggleOrder(order._id)}>
                                    <div className="order-info">
                                        <span>Order ID</span>
                                        <p>{order._id}</p>
                                    </div>
                                    <div className="order-info">
                                        <span>Date Placed</span>
                                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="order-info">
                                        <span>Total</span>
                                        <p>₹{order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="order-toggle-icon">
                                        {/* This icon will rotate */}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"></path></svg>
                                    </div>
                                </div>
                                
                                {/* The body will be hidden/shown with CSS */}
                                <div className="order-body">
                                    <div className="order-body-inner">
                                        <h4>Items</h4>
                                        {order.orderItems.map((item) => (
                                            <div key={item.product._id} className="order-item">
                                                <img src={item.product.imageUrl || 'https://via.placeholder.com/75'} alt={item.product.name} />
                                                <div className="order-item-details">
                                                    <span>{item.product ? item.product.name : 'Item not available'}</span>
                                                    <span className="item-qty">Qty: {item.quantity}</span>
                                                </div>
                                                <div className="order-item-price">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;