import { Member, File, RamzanMemberV3 } from "models";

export const verifyHofIdAndFileNumber = async (request, response) => {
  try {
    const { hofId, fileNumber } = request.body;
    const findHof = await Member.findOne({ _id: hofId, hof_fm_type: "HOF" });
    if (!findHof) {
      return response.status(500).send("HOF Not Found");
    }
    const findFile = await File.findOne({
      _id: hofId,
      tanzeem_file_no: fileNumber
    });
    if (!findFile) {
      return response.status(500).send("File Not Found");
    }

    const findRamzanData = await RamzanMemberV3.find({ hof_id: hofId });

    return response.status(200).send(findRamzanData);
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
