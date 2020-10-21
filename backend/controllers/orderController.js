// asyncHandler is used to wrap async functions to catch errors instead of writing multiple try catch statements
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  PRIVATE
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Check order is not empty
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      // Get current user id from token
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // Save order
    const createdOrder = await order.save();

    // Return the created order object
    res.status(201).json(createdOrder);
  }
});

// @desc    Get an order by id
// @route   GET /api/orders/:id
// @access  PRIVATE
const getOrderById = asyncHandler(async (req, res) => {
  // Fetch order from url order id
  // And get users name and email associated with the order
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  PRIVATE
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // Fetch order from url order id
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Response from PayPal after user has paid
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export { addOrderItems, getOrderById, updateOrderToPaid };
