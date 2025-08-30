// server/controllers/OrderController.js

const Order = require('../models/orderModels');
const ShopItem = require('../models/ShopItemModel'); // Ensure this path is correct for your ShopItem model

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Requires user to be logged in)

const addOrderItems = async (req, res, next) => {
  // Destructure the data sent from your new CheckoutPage
  const {
    orderItems, // <-- This is the array of items from the request body
    shippingAddress,
    paymentMethod
    // itemsPrice, taxPrice, shippingPrice, totalPrice will be RECALCULATED for security
  } = req.body;

  if (!orderItems || orderItems.length === 0) { // More robust check for orderItems
    res.status(400);
    throw new Error('No order items');
  }

  try {
    // --- CRITICAL SECURITY STEP: Recalculate the price on the server ---
    // 1. Get the IDs of the items from the user's orderItems (from req.body)
    const itemIds = orderItems.map(item => item._id || item.product); // Use product ID if _id isn't present for frontend items

    // 2. Fetch those items directly from your database to get their true prices
    const itemsFromDB = await ShopItem.find({ _id: { $in: itemIds } });

    // 3. Calculate the total price securely and prepare verified order items
    let calculatedItemsPrice = 0;
    const verifiedOrderItems = orderItems.map(reqItem => {
        const dbItem = itemsFromDB.find(item => item._id.toString() === (reqItem._id || reqItem.product));

        // If an item from the request doesn't exist in the DB, something is wrong.
        if (!dbItem) {
            res.status(404);
            throw new Error(`Item not found in database: ${reqItem.name || reqItem.product}`);
        }

        // Add the price from the DATABASE * the quantity from the request
        const itemTotalPrice = dbItem.price * reqItem.quantity;
        calculatedItemsPrice += itemTotalPrice;

        // Return a structured item for the order, using verified data
        return {
            name: dbItem.name,
            quantity: reqItem.quantity,
            // Always use the price from the database for security
            price: dbItem.price,
            image: dbItem.image, // Include image if your frontend sends it or if you want to store it
            product: dbItem._id, // Link to the original product (from DB)
        };
    });

    // Assume tax and shipping are fixed or calculated separately on server
    // For now, let's just make them simple calculations or fixed values.
    const taxPrice = calculatedItemsPrice * 0.08; // Example: 8% tax
    const shippingPrice = calculatedItemsPrice > 100 ? 0 : 10; // Example: free shipping over $100
    const finalTotalPrice = calculatedItemsPrice + taxPrice + shippingPrice;

    // --- Create the new order object ---
    const order = new Order({
      user: req.user._id, // This comes from your 'protect' middleware
      orderItems: verifiedOrderItems, // Use the securely verified and structured items
      shippingAddress,
      paymentMethod, // Assuming paymentMethod is passed and valid
      itemsPrice: calculatedItemsPrice, // Store the server-calculated items price
      taxPrice, // Store server-calculated tax
      shippingPrice, // Store server-calculated shipping
      totalPrice: finalTotalPrice, // Use the secure, server-calculated final total price

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
    res.status(error.statusCode || 500).json({ // Use statusCode if set by a custom error, otherwise 500
        message: error.message || 'Server error while creating order'
    });
  }
};


// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email') // You might want to populate the user who placed the order
      .populate('orderItems.product') // <--- THIS IS THE KEY CHANGE
      .exec();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { addOrderItems, getMyOrders };