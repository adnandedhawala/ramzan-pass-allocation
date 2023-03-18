import nc from "next-connect";
import { ncErrorHandlers } from "be/utils";
import { checkAdmin, checkAuth, connectDB } from "be/middlewares";
import {
  allocateRamzanMemberToMasallah,
  getAllocatedmembersController,
  resetAllocations,
  updateAllocatedmembersController
} from "be/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .use(checkAdmin)
  .post(allocateRamzanMemberToMasallah)
  .put(resetAllocations)
  .get(getAllocatedmembersController)
  .patch(updateAllocatedmembersController);
