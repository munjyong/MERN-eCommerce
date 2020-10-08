import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";

import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Enable environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Use product routes
app.use("/api/products", productRoutes);

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
