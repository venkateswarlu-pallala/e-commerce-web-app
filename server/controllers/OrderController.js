// server/controllers/OrderController.js

const Order = require('../models/orderModels');
const ShopItem = require('../models/shopItemModel'); // Ensure this path is correct for your ShopItem model

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Requires user to be logged in)
const addOrderItems = async (req, res) => {
  // Destructure the data sent from your new CheckoutPage
  const { cartItems, shippingAddress } = req.body;

  if (!cartItems || cartItems.length === 0) {
    // If the cart is empty, send a 400 Bad Request error
    res.status(400);
    throw new Error('No order items');
  }

  try {
    // --- CRITICAL SECURITY STEP: Recalculate the price on the server ---
    // 1. Get the IDs of the items from the user's cart
    const itemIds = cartItems.map(item => item._id);

    // 2. Fetch those items directly from your database to get their true prices
    const itemsFromDB = await ShopItem.find({ _id: { $in: itemIds } });

    // 3. Calculate the total price securely
    const totalPrice = cartItems.reduce((acc, cartItem) => {
      const dbItem = itemsFromDB.find(item => item._id.toString() === cartItem._id);
      // If an item from the cart doesn't exist in the DB, something is wrong.
      if (!dbItem) {
        res.status(404);
        throw new Error(`Item not found in database: ${cartItem.name}`);
      }
      // Add the price from the DATABASE * the quantity from the cart
      return acc + dbItem.price * cartItem.quantity;
    }, 0);


    // --- Create the new order object ---
    // This object's structure now perfectly matches your updated orderModels.js schema
    const order = new Order({
      user: req.user._id, // This comes from your 'protect' middleware
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price, // Store the price at time of purchase
        product: item._id, // Link to the original product
      })),
      shippingAddress,
      totalPrice, // Use the secure, server-calculated total price

      // This is the "Dummy Payment" simulation
      isPaid: true,
      paidAt: Date.now(),
    });

    // Save the newly created order to the database
    const createdOrder = await order.save();

    // Send the created order back to the front-end with a 201 Created status
    res.status(201).json(createdOrder);

  } catch (error) {
    // If anything goes wrong, send a detailed error message
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message || 'Server error while creating order' });
  }
};


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('orderItems.product', 'name price imageUrl');
  res.json(orders);
};


module.exports = { addOrderItems, getMyOrders };