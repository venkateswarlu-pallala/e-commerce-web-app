// src/pages/LoginPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('userInfo')) {
            navigate('/');
        }
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let data;
            if (isLogin) {
                // FIX: Added '/api' prefix here
                const response = await api.post('/api/users/login', { email, password });
                data = response.data;
            } else {
                // FIX: Added '/api' prefix here
                const response = await api.post('/api/users/register', { name, email, password });
                data = response.data;
            }
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = '/'; // Use a hard refresh to update header state
        } catch (err) {
            // Enhanced error handling for clarity
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
            console.error('API Error:', err.response?.data || err.message); // Log the full error for debugging
        }
    };

    // Reset fields when toggling
    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className="login-page-container">
            <div className="login-panel">
                <div className="login-header">
                    <Link to="/" className="login-logo">V-shop</Link>
                    <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                </div>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={submitHandler} className="login-form">
                    {/* Add a dynamic key to reset the component state on toggle for the animation */}
                    <div key={isLogin ? 'login' : 'signup'} className="form-content">
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    placeholder="e.g. John Doe"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                placeholder="e.g. johndoe@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-glow btn-submit">
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <div className="toggle-section">
                    <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
                    <button onClick={toggleForm} className="btn-toggle">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;