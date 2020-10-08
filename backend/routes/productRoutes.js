import express from "express";
// asyncHandler is used to wrap async functions to catch errors instead of writing multiple try catch statements
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  PUBLIC
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Load all products
    const products = await Product.find({});

    res.json(products);
  })
);

// @desc    Fetch a single product
// @route   GET /api/products/:id
// @access  PUBLIC
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // Finds product by grabbing the product id from URL
    const product = await Product.findById(req.params.id);

    // Check if product is found
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

export default router;
