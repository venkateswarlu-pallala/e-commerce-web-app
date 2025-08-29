const express = require('express');
const router = express.Router();
const { getShopItems, addShopItem, updateShopItem, deleteShopItem } = require('../controllers/ShopContoller');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getShopItems).post(protect, admin, addShopItem);
router.route('/:id').put(protect, admin, updateShopItem).delete(protect, admin, deleteShopItem);

module.exports = router; // This line should be in your shopRoutes.js file