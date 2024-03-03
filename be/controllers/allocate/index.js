/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable security/detect-object-injection */
import { SEAT_LOCATIONS } from "appConstants";
import { addAllocationSchema, updateAllocationSchema } from "be/validators";
import { groupBy } from "lodash";
import { Masallah, RamzanMember } from "models";

export const allocateRamzanMemberToMasallah = async (request, response) => {
  const { data } = request.body;
  if (!data) return response.status(400).end("data is missing!");
  addAllocationSchema
    .validate(data)
    .then(async editObject => {
      const { location, data: newData } = editObject;
      const queryLocation = location.split(",");
      try {
        await Masallah.updateMany(
          { location: { $in: queryLocation } },
          { d1: "", d2: "", d3: "" }
        );
      } catch (error) {
        return response.status(500).send(error.message);
      }
      const bulkOps = newData.map(update => {
        const setObject = {
          d1: update?.d1 || "",
          d2: update?.d2 || "",
          d3: update?.d3 || ""
        };
        return {
          updateOne: {
            filter: { _id: update._id },
            update: { $set: setObject }
          }
        };
      });
      Masallah.bulkWrite(bulkOps)
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
    await Masallah.updateMany({}, { d1: "", d2: "", d3: "" });
    await RamzanMember.updateMany(
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
          d3: { location: "", masallah: "" },
          show_pass: false
        }
      : { [daska]: { location: "", masallah: "" } };
    let initFindObject = isLocationMasjid
      ? {
          "d1.location": location
        }
      : { [daska + ".location"]: location };

    let currentDaska = isLocationMasjid ? "d1" : daska;

    await RamzanMember.updateMany(initFindObject, initUpdateObject);

    let data = await Masallah.find(
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
              d3: { location, masallah: groupedData[key][0]._id },
              show_pass: true
            }
          : { [daska]: { location, masallah: groupedData[key][0]._id } };
      return {
        updateOne: {
          filter: { _id: key },
          update: { $set: setObject }
        }
      };
    });

    RamzanMember.bulkWrite(bulkOps)
      .then(result => {
        response.status(200).send(`Updated ${result.nModified} documents`);
      })
      .catch(error => response.status(400).send(error.message));
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const allocateMasallahToMembersV2 = async (request, response) => {
  const { location } = request.query;
  const isLocationMasjid = location === SEAT_LOCATIONS.MASJID;
  const queryLocation = location.split(",");
  if (!location) return response.status(400).end("location is missing!");
  try {
    let findQueryObject = isLocationMasjid
      ? { location: { $in: queryLocation }, d1: { $ne: "" } }
      : {
          $and: [
            { location: { $in: queryLocation } },
            {
              $or: [
                { d1: { $ne: "" } },
                { d2: { $ne: "" } },
                { d3: { $ne: "" } }
              ]
            }
          ]
        };
    let initUpdateObject = {
      d1: { location: "", masallah: "" },
      d2: { location: "", masallah: "" },
      d3: { location: "", masallah: "" },
      show_pass: false
    };
    let initFindObject = isLocationMasjid
      ? {
          "d1.location": location
        }
      : {
          $or: [
            { "d1.location": { $in: queryLocation } },
            { "d2.location": { $in: queryLocation } },
            { "d3.location": { $in: queryLocation } }
          ]
        };

    await RamzanMember.updateMany(initFindObject, initUpdateObject);

    let data = await Masallah.find(
      findQueryObject,
      "d1 d2 d3 location seat_number"
    );
    const groupedDataD1 = groupBy(data, "d1");
    const groupedDataD2 = groupBy(data, "d2");
    const groupedDataD3 = groupBy(data, "d3");

    let bulkOps = [];

    if (location === SEAT_LOCATIONS.MASJID) {
      bulkOps = Object.keys(groupedDataD1).map(key => {
        return {
          updateOne: {
            filter: { _id: key },
            update: {
              $set: {
                d1: { location, masallah: groupedDataD1[key][0]._id },
                d2: { location, masallah: groupedDataD1[key][0]._id },
                d3: { location, masallah: groupedDataD1[key][0]._id },
                show_pass: true
              }
            }
          }
        };
      });
    } else {
      const keys = new Set([
        ...Object.keys(groupedDataD1),
        ...Object.keys(groupedDataD2),
        ...Object.keys(groupedDataD2)
      ]);

      bulkOps = [...keys]
        .filter(value => !!value)
        .map(key => {
          const d1Object = groupedDataD1[key]
            ? {
                location: groupedDataD1[key][0].location,
                masallah: groupedDataD1[key][0]._id
              }
            : { location: "", masallah: "" };
          const d2Object = groupedDataD2[key]
            ? {
                location: groupedDataD2[key][0].location,
                masallah: groupedDataD2[key][0]._id
              }
            : { location: "", masallah: "" };
          const d3Object = groupedDataD3[key]
            ? {
                location: groupedDataD3[key][0].location,
                masallah: groupedDataD3[key][0]._id
              }
            : { location: "", masallah: "" };

          return {
            updateOne: {
              filter: { _id: key },
              update: {
                $set: {
                  d1: d1Object,
                  d2: d2Object,
                  d3: d3Object,
                  show_pass: true
                }
              }
            }
          };
        });
    }
    RamzanMember.bulkWrite(bulkOps)
      .then(result => {
        response.status(200).send(`Updated ${result.nModified} documents`);
      })
      .catch(error => response.status(400).send(error.message));
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const getAllocatedmembersController = async (_request, response) => {
  try {
    let data = await RamzanMember.find({
      $or: [
        { "d1.location": { $ne: "" } },
        { "d2.location": { $ne: "" } },
        { "d3.location": { $ne: "" } }
      ]
    }).populate([
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
    ]);
    return response.status(200).send({ data });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const updateAllocatedmembersController = async (request, response) => {
  const { data } = request.body;
  if (!data) return response.status(400).end("data is missing!");
  updateAllocationSchema
    .validate(data)
    .then(async editObject => {
      const bulkOps = editObject.map(update => {
        const setObject = { show_pass: update.show_pass };
        return {
          updateOne: {
            filter: { _id: update._id },
            update: { $set: setObject }
          }
        };
      });

      RamzanMember.bulkWrite(bulkOps)
        .then(result => {
          response.status(200).send(`Updated ${result.nModified} documents`);
        })
        .catch(error => response.status(400).send(error.message));
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};
