import mongoose from "mongoose";
import colors from "colors";

const connectDb = async () => {
  try {
    const connect_ = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Database Connected at ${mongoose.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Mongoose Error ${error}`.bgRed.white);
  }
};

export default connectDb;
