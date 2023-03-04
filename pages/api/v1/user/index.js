import nc from "next-connect";
import { ncErrorHandlers } from "be/utils";
import { checkAuth, connectDB } from "be/middlewares";
import { getUsersController } from "be/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .get(getUsersController);
