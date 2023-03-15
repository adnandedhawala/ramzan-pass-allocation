import nc from "next-connect";
import { ncErrorHandlers } from "be/utils";
import { checkAdmin, checkAuth, connectDB } from "be/middlewares";
import { editSettingsController, getSettingsController } from "be/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .get(getSettingsController)
  .use(checkAuth)
  .use(checkAdmin)
  .patch(editSettingsController);
