import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import path from "path";
import morgan from "morgan";
import Stripe from "stripe";

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

const stripe = new Stripe(
  "sk_test_51HhNEPGQo4TRACXZ7APdsWRSeoPWlRMb445rvnCEM8Kv5sZuiiVpRt5hAdN1JQxy6ku2k1VsEY7gOY59NEY94lFJ00GRGcmj8m"
);

// Morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Allows body data to be parsed as JSON
app.use(express.json());

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

// Stripe
const calculateOrderAmount = (items) => {
  return 1200;
};

app.post("/api/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
  });
});

// Make build folder static and accessible by browser
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  // Any route not directing to the API will be directed to inedx.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

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
