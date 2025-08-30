const mongoose = require('mongoose');

const shopItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
        type: String, // e.g., 'electronics', 'clothing'
        required: true,
    },
    // Add any other fields your shop items have
  },
  {
    timestamps: true,
  }
);

const ShopItem = mongoose.model('ShopItem', shopItemSchema);

module.exports = ShopItem;