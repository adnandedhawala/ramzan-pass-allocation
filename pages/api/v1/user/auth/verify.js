import nc from "next-connect";
import { ncErrorHandlers } from "be/utils";
import { verifyUserController } from "be/controllers";

export default nc(ncErrorHandlers).post(verifyUserController);
