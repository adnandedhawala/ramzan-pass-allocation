/* eslint-disable unicorn/prevent-abbreviations */
import mongoose from "mongoose";

const connectionUrl =
  "mongodb+srv://" +
  process.env.NEXT_PUBLIC_MONGODB_USERNAME +
  ":" +
  process.env.NEXT_PUBLIC_MONGODB_PASSWORD +
  "@" +
  process.env.NEXT_PUBLIC_MONGODB_HOST +
  "/" +
  process.env.NEXT_PUBLIC_MONGODB_DBNAME;

export const connectDB = async (_request, _response, next) => {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(connectionUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
    }
    return next();
  } catch (error) {
    throw new Error(error.message);
  }
};
