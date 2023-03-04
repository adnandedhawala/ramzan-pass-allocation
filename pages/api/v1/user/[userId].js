import nc from "next-connect";
import { checkAuth, connectDB } from "be/middlewares";
import { ncErrorHandlers } from "be/utils";
import { getUserbyIdController } from "be/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .get(getUserbyIdController);
