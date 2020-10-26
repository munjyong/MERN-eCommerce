// asyncHandler is used to wrap async functions to catch errors instead of writing multiple try catch statements
import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  PUBLIC
const getProducts = asyncHandler(async (req, res) => {
  // Get keyword from query string in URL
  const keyword = req.query.keyword
    ? {
        // Set name
        name: {
          // Allows the user to find the product even if they don't type the name exactly
          $regex: req.query.keyword,
          // Case insensitive
          $options: "i",
        },
      }
    : {};

  const products = await Product.find({ ...keyword });

  res.json(products);
});

// @desc    Fetch a single product
// @route   GET /api/products/:id
// @access  PUBLIC
const getProductById = asyncHandler(async (req, res) => {
  // Finds product by grabbing the product id from URL
  const product = await Product.findById(req.params.id);

  // Check if product is found
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  PRIVATE/ADMIN
const deleteProduct = asyncHandler(async (req, res) => {
  // Finds product by grabbing the product id from URL
  const product = await Product.findById(req.params.id);

  // Check if product is found
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  PRIVATE/ADMIN
const createProduct = asyncHandler(async (req, res) => {
  // Create new product with sample data
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.png",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample Description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  PRIVATE/ADMIN
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  PRIVATE
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if the logged in user has already left a review
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Add review to product
    product.reviews.push(review);

    // Update review count
    product.numReviews = product.reviews.length;

    // Calc average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
