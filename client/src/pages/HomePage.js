// src/pages/MenuPage.js (or HomePage.js)

import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Use our centralized api service
import ProductCard from '../components/ProductCard'; // 1. Import our advanced, minimalist ProductCard
import './HomePage.css'; // 2. We will use the CSS designed for the shop page

const MenuPage = () => {
    // State for all items, filtered items, categories, and the active filter
    const [shopItems, setShopItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All'); // ✅ CORRECT



    useEffect(() => {
        const fetchShopItems = async () => {
            try {
                // 3. Ensure this endpoint matches your backend route for shop items
                const { data } = await api.get('/api/shop'); 
                setShopItems(data);
                setFilteredItems(data);
                
                // 4. Dynamically create the category list from the data
                const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching shop items:', error);
            }
        };
        fetchShopItems();
    }, []);

    // 5. Logic to filter items based on the selected category
    const filterShop = (category) => {
  setActiveCategory(category); // now this is a valid function
  if (category === 'All') {
    setFilteredItems(shopItems);
  } else {
    setFilteredItems(shopItems.filter(item => item.category === category));
  }
}


    return (
        <div className="shop-page">
            {/* Optional: Add a header if you like */}
            {/* 
            <div className="shop-header">
                <h1>Our Menu</h1>
                <p>Explore our delicious offerings.</p>
            </div>
            */}

            <div className="shop-filters">
                {categories.map(category => (
                    <button 
  key={category} 
  className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
  onClick={() => filterShop(category)}
>
  {category}
</button>
                ))}
            </div>

            <div className="product-grid">
                {/* 6. Render the advanced ProductCard for each item */}
                {filteredItems.map((item) => (
                    <ProductCard key={item._id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default MenuPage;