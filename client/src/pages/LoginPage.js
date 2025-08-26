import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        // If user is already logged in, redirect to home
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
                const response = await api.post('/users/login', { email, password });
                data = response.data;
            } else {
                const response = await api.post('/users/register', { name, email, password });
                data = response.data;
            }
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/'); // Redirect to homepage after login/register
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={submitHandler}>
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="btn-toggle">
                    {isLogin ? 'New customer? Create an account' : 'Have an account? Log in'}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;