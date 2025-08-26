import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShopPage = () => {
    const [ShopItems, setShopItems] = useState([]);

    useEffect(() => {
        const fetchShopItems = async () => {
            const { data } = await axios.get('http://localhost:5000/api/Shop');
            setShopItems(data);
        };
        fetchShopItems();
    }, []);

    const addToCartHandler = (item) => {
        // This is a simplified example. You would use context or redux for a real app.
        alert(`${item.name} added to cart!`);
    };

    return (
        <div>
            <h2>Our Shop</h2>
            <div className="Shop-grid">
                {ShopItems.map(item => (
                    <div key={item._id} className="Shop-item">
                        <img src={item.imageUrl} alt={item.name} />
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <h4>${item.price}</h4>
                        <button onClick={() => addToCartHandler(item)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;