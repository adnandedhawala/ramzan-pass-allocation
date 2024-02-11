import { verifyFileSchema } from "be/validators";
import { Masallah, Member, RamzanMember } from "models";

export const createMembersController = async (_request, response) => {
  try {
    await RamzanMember.deleteMany({});
    await Masallah.updateMany({}, { d1: "", d2: "", d3: "" });
    let memberData = await Member.find({});
    let ramzanMemberData = memberData.map(({ _id, hof_id }) => ({
      _id,
      member_details: _id,
      hof_id: hof_id.toString()
    }));
    let databaseResponse = await RamzanMember.insertMany(ramzanMemberData);
    return response.status(200).send(databaseResponse);
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const getMembersController = async (request, response) => {
  const { showRegistered } = request.query;
  const findQuery = showRegistered === "true" ? { is_registered: true } : {};
  try {
    const populationQuery = [
      {
        path: "hof_id",
        select: "_id tanzeem_file_no",
        model: "File"
      },
      {
        path: "member_details",
        select: "_id full_name gender hof_fm_type age first_prefix idara",
        model: "Member"
      }
    ];
    const data = await RamzanMember.find({ ...findQuery }).populate(
      populationQuery
    );
    return response.status(200).send({ data });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const resetRegistrationController = async (_request, response) => {
  try {
    await RamzanMember.updateMany(
      { is_registered: true },
      {
        is_registered: false,
        registration: {
          d1: false,
          d2: false,
          d3: false
        },
        is_rahat: false
      }
    );
    return response.status(200).send("data reset successfull");
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const verifyFileandGetMembersController = async (request, response) => {
  const { data } = request.body;
  if (!data) response.status(400).end("data is missing!");
  verifyFileSchema
    .validate(data)
    .then(async verifyFileObject => {
      const { hof_id, file_number } = verifyFileObject;
      let registrationData = [];
      const member = await RamzanMember.findById(hof_id).populate([
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
        if (
          member.hof_id &&
          (member.hof_id.tanzeem_file_no !== file_number ||
            member.hof_id._id !== hof_id)
        ) {
          response.status(400).send("Incorrect HOF ITS or File Number!");
        } else {
          try {
            registrationData = await RamzanMember.find({
              _id: {
                $in: member.hof_id.member_ids.map(value => value._id)
              }
            }).populate([
              {
                path: "member_details",
                model: "Member"
              }
            ]);
          } catch (error) {
            response.status(500).send(error.message);
          }
          response.status(200).send({ data: registrationData });
        }
      } else {
        return response.status(400).send("hof not found!");
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};

export const verifyFileandGetMemberByIdController = async (
  request,
  response
) => {
  const { data } = request.body;
  if (!data) response.status(400).end("data is missing!");
  verifyFileSchema
    .validate(data)
    .then(async verifyFileObject => {
      const { hof_id, file_number } = verifyFileObject;
      const member = await RamzanMember.findById(hof_id).populate([
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
        if (member.hof_id && member.hof_id.tanzeem_file_no !== file_number) {
          response.status(400).send("Incorrect ITS or File Number!");
        } else {
          response.status(200).send({ data: [member] });
        }
      } else {
        return response.status(400).send("member not found!");
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};
