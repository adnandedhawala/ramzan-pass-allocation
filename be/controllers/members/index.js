import { MasallahV2, Member, RamzanMemberV3 } from "models";

export const createMembersController = async (_request, response) => {
  try {
    await RamzanMemberV3.deleteMany({});
    await MasallahV2.updateMany({}, { d1: "", d2: "", d3: "" });
    let memberData = await Member.find({});
    let ramzanMemberData = memberData.map(({ _id, hof_id }) => ({
      _id,
      member_details: _id,
      hof_id: hof_id.toString()
    }));
    let databaseResponse = await RamzanMemberV3.insertMany(ramzanMemberData);
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
    const data = await RamzanMemberV3.find({ ...findQuery }).populate(
      populationQuery
    );
    return response.status(200).send({ data });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const resetRegistrationController = async (_request, response) => {
  try {
    await RamzanMemberV3.updateMany(
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
