/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable security/detect-object-injection */
import { SEAT_LOCATIONS } from "appConstants";
import { addAllocationSchema } from "be/validators";
import { groupBy } from "lodash";
import { MasallahV2, RamzanMemberV3 } from "models";

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
    await RamzanMemberV3.updateMany(
      {},
      {
        d1: { location: "", masallah: "" },
        d2: { location: "", masallah: "" },
        d3: { location: "", masallah: "" }
      }
    );
    return response.status(200).send("Data reset successfull");
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const allocateMasallahToMembers = async (request, response) => {
  const { location, daska } = request.query;
  const isLocationMasjid = location === SEAT_LOCATIONS.MASJID;
  if (!location) return response.status(400).end("location is missing!");
  if (
    location !== SEAT_LOCATIONS.MASJID &&
    (!daska || !["d1", "d2", "d3"].includes(daska))
  )
    return response.status(400).end("daska is missing!");

  try {
    let findQueryObject = isLocationMasjid
      ? { location, d1: { $ne: "" } }
      : { location, [daska]: { $ne: "" } };
    let initUpdateObject = isLocationMasjid
      ? {
          d1: { location: "", masallah: "" },
          d2: { location: "", masallah: "" },
          d3: { location: "", masallah: "" }
        }
      : { [daska]: { location: "", masallah: "" } };
    let initFindObject = isLocationMasjid
      ? {
          "d1.location": location
        }
      : { [daska + ".location"]: location };

    let currentDaska = isLocationMasjid ? "d1" : daska;

    await RamzanMemberV3.updateMany(initFindObject, initUpdateObject);

    let data = await MasallahV2.find(
      findQueryObject,
      "d1 d2 d3 location seat_number"
    );
    const groupedData = groupBy(data, currentDaska);
    const bulkOps = Object.keys(groupedData).map(key => {
      const setObject =
        location === SEAT_LOCATIONS.MASJID
          ? {
              d1: { location, masallah: groupedData[key][0]._id },
              d2: { location, masallah: groupedData[key][0]._id },
              d3: { location, masallah: groupedData[key][0]._id }
            }
          : { [daska]: { location, masallah: groupedData[key][0]._id } };
      return {
        updateOne: {
          filter: { _id: key },
          update: { $set: setObject }
        }
      };
    });

    RamzanMemberV3.bulkWrite(bulkOps)
      .then(result => {
        response.status(200).send(`Updated ${result.nModified} documents`);
      })
      .catch(error => response.status(400).send(error.message));
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
