const mongoose = require('mongoose');

const ShopItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
});

module.exports = mongoose.model('ShopItem', ShopItemSchema);