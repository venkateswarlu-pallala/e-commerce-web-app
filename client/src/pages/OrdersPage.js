import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './OrdersPage.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Could not fetch orders', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <p>Loading orders...</p>;
    }

    return (
        <div className="orders-page">
            <h2>My Order History</h2>
            {orders.length === 0 ? (
                <p>You have no past orders.</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <h3>Order ID: {order._id}</h3>
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="order-body">
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            <span>{item.ShopItem ? item.ShopItem.name : 'Item not available'}</span>
                                            <span>Qty: {item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-footer">
                                <h4>Total: ${order.totalAmount.toFixed(2)}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;