// src/pages/OrderSuccessPage.js

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './OrderSuccessPage.css'; // We will create this CSS file

const OrderSuccessPage = () => {
    const { id } = useParams(); // Gets the order ID from the URL

    return (
        <div className="order-success-container">
            <div className="order-success-panel">
                <div className="success-checkmark">
                    <svg className="checkmark-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                
                <h1 className="success-title">Order Placed Successfully!</h1>
                <p className="success-message">Thank you for your purchase. A confirmation has been sent to your email.</p>
                
                <div className="order-id-display">
                    <span>Your Order ID</span>
                    <p>{id}</p>
                </div>
                
                <div className="success-actions">
                    <Link to="/orders" className="btn btn-primary">View My Orders</Link>
                    <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;