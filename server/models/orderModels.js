// server/models/orderModels.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The field is now 'orderItems', matching the controller
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        // The field is 'product', which links to the 'ShopItem' model
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'ShopItem', // This ref should match the name you used when creating the ShopItem model
        },
      },
    ],
    // Added the shippingAddress object
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    // Renamed to 'totalPrice' to match the controller
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // Added 'isPaid' for the dummy payment simulation
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Added 'paidAt'
    paidAt: {
      type: Date,
    },
  },
  {
    // `timestamps` automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Use the idempotent model pattern to prevent overwrite errors
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);