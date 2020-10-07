import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clears all existiing data in the collections before importing
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // The list of created users in users.js
    const createdUsers = await User.insertMany(users);
    // Grabbing the admin user id, who is the first user in users.js
    const adminUser = createdUsers[0]._id;

    // Adds the 'user' field in the product object and sets it to be the admin user
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log("Data Imported".green.bold.inverse);
    process.exit();
  } catch (e) {
    console.error(`${e}`).red.bold.inverse;
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clears all existiing data in the collections before importing
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed".red.bold.inverse);
    process.exit();
  } catch (e) {
    console.error(`${e}`).red.bold.inverse;
    process.exit(1);
  }
};

// Checks the run command args whether to import or destroy data
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
