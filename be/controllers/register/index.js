import { registerSchema, verifyFileSchema } from "be/validators";
import { find } from "lodash";
import { Member, RamzanMemberV3 } from "models";

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

const checkDaskaEntry = (list, values) => {
  return !list
    .filter(value => value.gender === "Female")
    .map(value => {
      const data = find(values, { _id: value._id });
      return Object.values(data.registration).every(daska => daska === true);
    })
    .includes(true);
};

export const registerController = async (request, response) => {
  const { data } = request.body;
  if (!data) response.status(400).end("data is missing!");
  registerSchema
    .validate(data)
    .then(async registerObject => {
      const idList = registerObject.map(value => value._id);
      let memberList = [];
      try {
        memberList = await Member.find({
          _id: {
            $in: idList
          }
        });
      } catch (error) {
        return response.status(500).send(error.message);
      }

      if (checkDaskaEntry(memberList, registerObject)) {
        const bulkOps = registerObject.map(
          ({ _id, registration, is_rahat }) => {
            const setObject = {
              registration,
              is_rahat,
              is_registered: true
            };
            return {
              updateOne: {
                filter: { _id },
                update: { $set: setObject }
              }
            };
          }
        );

        RamzanMemberV3.bulkWrite(bulkOps)
          .then(result => {
            response.status(200).send(`Updated ${result.nModified} documents`);
          })
          .catch(error => response.status(400).send(error.message));
      } else {
        return response.status(400).send("invalid data");
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};
