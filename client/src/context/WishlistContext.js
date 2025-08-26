import React, { createContext, useState, useEffect, useContext } from "react";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const localData = localStorage.getItem("wishlistItems");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    setWishlistItems((prevItems) => {
      const isItemInWishlist = prevItems.find((wishlistItem) => wishlistItem._id === item._id);
      if (isItemInWishlist) {
        // Optional: If you want to notify the user that the item is already there
        console.log("Item is already in the wishlist.");
        return prevItems;
      }
      return [...prevItems, item];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  const isItemInWishlist = (id) => {
    return wishlistItems.some((item) => item._id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isItemInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;