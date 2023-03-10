import nc from "next-connect";
import { ncErrorHandlers } from "be/utils";
import { connectDB } from "be/middlewares";
import { verifyFileController } from "be/controllers";

export default nc(ncErrorHandlers).use(connectDB).post(verifyFileController);
