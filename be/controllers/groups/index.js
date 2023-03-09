import { editGroupSchema } from "be/validators";
import { MasallahGroupV2 } from "models";

export const getGroupsController = async (_request, response) => {
  try {
    const groupList = await MasallahGroupV2.find({});
    const sortedGroupList = groupList.sort((a, b) => a.location - b.location);
    response.status(200).json({ data: sortedGroupList });
  } catch (error) {
    response.status(500).send(error.message);
  }
};

export const editGroupController = async (request, response) => {
  const { data } = request.body;
  const { groupId } = request.query;
  if (!groupId) return response.status(404).send("invalid group");
  if (!data) return response.status(400).end("data is missing!");
  editGroupSchema
    .validate(data)
    .then(async editObject => {
      const result = await MasallahGroupV2.findByIdAndUpdate(
        groupId,
        editObject
      );
      if (result) {
        response.status(200).send("Group Edited Successfully!");
      } else {
        response.status(400).send("Incorrect Group id");
      }
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};
