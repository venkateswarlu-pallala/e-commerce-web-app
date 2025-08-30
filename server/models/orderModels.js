const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  // This 'ref' is crucial for population!
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ShopItem', // This MUST match the model name registered in ShopItemModel.js
  },
});

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Assuming you have a User model
    },
    orderItems: [orderItemSchema], // Array of order items
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    // ... other fields like paymentResult, isDelivered, deliveredAt
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;