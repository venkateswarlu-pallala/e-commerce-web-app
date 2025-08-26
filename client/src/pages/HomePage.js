import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard'; // 1. Import the new component
import './HomePage.css';

const HomePage = () => {
  const [shopItems, setShopItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const { data } = await api.get('/shop'); // Corrected endpoint to be lowercase
        setShopItems(data);
        setFilteredItems(data);
        const uniqueCategories = ['All', ...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      }
    };
    fetchShopItems();
  }, []);

  const filterShop = (category) => {
    if (category === 'All') {
      setFilteredItems(shopItems);
    } else {
      setFilteredItems(shopItems.filter(item => item.category === category));
    }
  };

  return (
    <div className="homepage">
      <div className="shop-filters">
        {categories.map(category => (
          <button key={category} onClick={() => filterShop(category)}>
            {category}
          </button>
        ))}
      </div>

      {/* 2. Use the ProductCard component in a loop */}
      <div className="shop-list">
        {filteredItems.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;