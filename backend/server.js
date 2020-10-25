import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import path from "path";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Enable environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Allows body data to be parsed as JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Image uploads
app.use("/api/upload", uploadRoutes);
// Make uploads folder static so it can be access by the browser
// __dirname returns the path of the folder where the current JavaScript file resides
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// Products
app.use("/api/products", productRoutes);
// User auth
app.use("/api/users", userRoutes);
// Orders
app.use("/api/orders", orderRoutes);

// PayPal
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// Invalid route
app.use(notFound);

// Invalid product id
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Listening in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
      .inverse
  )
);
