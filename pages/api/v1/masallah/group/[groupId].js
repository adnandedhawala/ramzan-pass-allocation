import nc from "next-connect";
import { ncErrorHandlers } from "be/utils";
import { checkAdmin, checkAuth, connectDB } from "be/middlewares";
import { editGroupController } from "be/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .use(checkAdmin)
  .patch(editGroupController);
