/* eslint-disable sonarjs/cognitive-complexity */
import { ObjectId } from "mongodb";
import { User } from "models";

const invalidUserIdMessage = "invalid User Id";
const userNotFoundMessage = "User not found";

export const getUsersController = async (_request, response) => {
  try {
    const users = await User.find({});
    return response.status(200).json({ data: users });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const getUserbyIdController = async (request, response) => {
  const { userId } = request.query;
  if (!userId) return response.status(404).send(invalidUserIdMessage);
  try {
    const data = await User.findOne({
      _id: ObjectId(userId),
      is_active: true
    }).populate("department");
    return data
      ? response.status(200).json({ data })
      : response.status(404).send(userNotFoundMessage);
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export * from "./login";
