import { verifyFileSchema } from "be/validators";
import { RamzanMemberV3 } from "models";

export const verifyFileController = async (request, response) => {
  const { data } = request.body;
  if (!data) response.status(400).end("data is missing!");
  verifyFileSchema
    .validate(data)
    .then(async verifyFileObject => {
      const { hof_id, file_number } = verifyFileObject;
      const member = await RamzanMemberV3.findById(hof_id).populate([
        {
          path: "hof_id",
          model: "File",
          populate: {
            path: "member_ids",
            model: "Member"
          }
        },
        {
          path: "member_details",
          model: "Member"
        }
      ]);
      if (member) {
        return member.hof_id &&
          (member.hof_id.tanzeem_file_no !== file_number ||
            member.hof_id._id !== hof_id)
          ? response.status(400).send("incorrect data!")
          : response.status(200).send({ data: member.hof_id.member_ids });
      } else {
        return response.status(400).send("hof not found!");
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};
