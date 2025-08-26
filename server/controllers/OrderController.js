const Order = require('../models/orderModels');

// @desc    Create new order
// @route   POST /api/orders
const addOrderItems = async (req, res) => {
  const { items, totalAmount } = req.body;

  if (items && items.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.menuItem', 'name price');
  res.json(orders);
};

module.exports = { addOrderItems, getMyOrders };