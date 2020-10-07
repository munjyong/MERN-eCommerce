import express from "express";
import dotenv from "dotenv";
import products from "./data/products.js";
import connectDB from "./config/db.js";

// Enable environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((product) => product._id === req.params.id);
  res.json(product);
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Listening in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
