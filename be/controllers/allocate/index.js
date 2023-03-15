/* eslint-disable security/detect-object-injection */
import { SEAT_LOCATIONS } from "appConstants";
import { addAllocationSchema } from "be/validators";
import { MasallahV2 } from "models";

export const allocateRamzanMemberToMasallah = async (request, response) => {
  const { data } = request.body;
  if (!data) return response.status(400).end("data is missing!");
  addAllocationSchema
    .validate(data)
    .then(async editObject => {
      const { location, daska, data: newData } = editObject;
      try {
        await (location === SEAT_LOCATIONS.MASJID
          ? MasallahV2.updateMany({ location }, { d1: "", d2: "", d3: "" })
          : MasallahV2.updateMany({ location }, { [daska]: "" }));
      } catch (error) {
        return response.status(500).send(error.message);
      }
      const bulkOps = newData.map(update => {
        const setObject =
          location === SEAT_LOCATIONS.MASJID
            ? { d1: update[daska], d2: update[daska], d3: update[daska] }
            : { [daska]: update[daska] };
        return {
          updateOne: {
            filter: { _id: update._id },
            update: { $set: setObject }
          }
        };
      });
      MasallahV2.bulkWrite(bulkOps)
        .then(result => {
          response.status(200).send(`Updated ${result.nModified} documents`);
        })
        .catch(error => response.status(400).send(error.message));
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};

export const resetAllocations = async (_request, response) => {
  try {
    await MasallahV2.updateMany({}, { d1: "", d2: "", d3: "" });
    return response.status(200).send("Data reset successfull");
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
