const ShopItem = require('../models/ShopItemModel');

// @desc    Get all shop items
// @route   GET /api/shop
const getShopItems = async (req, res) => {
  try {
    const shopItems = await ShopItem.find({});
    res.json(shopItems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a shop item
// @route   POST /api/shop
const addShopItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const shopItem = new ShopItem({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    const createdShopItem = await shopItem.save();
    res.status(201).json(createdShopItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a shop item
// @route   PUT /api/shop/:id
const updateShopItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const shopItem = await ShopItem.findById(req.params.id);

    if (shopItem) {
      shopItem.name = name || shopItem.name;
      shopItem.description = description || shopItem.description;
      shopItem.price = price || shopItem.price;
      shopItem.category = category || shopItem.category;
      shopItem.imageUrl = imageUrl || shopItem.imageUrl;

      const updatedShopItem = await shopItem.save();
      res.json(updatedShopItem);
    } else {
      res.status(404).json({ message: 'Shop item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a shop item
// @route   DELETE /api/shop/:id
const deleteShopItem = async (req, res) => {
  try {
    const shopItem = await ShopItem.findById(req.params.id);

    if (shopItem) {
      await shopItem.remove();
      res.json({ message: 'Shop item removed' });
    } else {
      res.status(404).json({ message: 'Shop item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getShopItems,
  addShopItem,
  updateShopItem,
  deleteShopItem,
};
