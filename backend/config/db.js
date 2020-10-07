import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      // Added options to remove warning messages
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    console.log(
      `MongoDB connected: ${connection.connection.host}`.green.bold.inverse
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold.inverse);
    process.exit(1);
  }
};

export default connectDB;
