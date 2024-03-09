import nc from "next-connect";
import { ncErrorHandlers } from "be/utils";
import { connectDB } from "be/middlewares";
import { fixesController } from "be/controllers/fixes";

export default nc(ncErrorHandlers).use(connectDB).post(fixesController);
