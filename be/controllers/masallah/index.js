/* eslint-disable security/detect-object-injection */
import formidable from "formidable";
import { Masallah, MasallahGroup, RamzanMemberV3 } from "models";
import * as XLSX from "xlsx";

export const uploadGridController = async (request, response) => {
  const form = new formidable.IncomingForm({});
  form.parse(request, async (error, fields, files) => {
    if (error) {
      return response
        .status(500)
        .send("An error occurred while processing the form.");
    }
    const workbook = XLSX.readFile(files.file.filepath, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    let cells = [];
    let groups = {};
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellReference = XLSX.utils.encode_cell({ r: col, c: row });
        const groupNumber = jsonData[row][col];
        groups[groupNumber] = groups[groupNumber] ? groups[groupNumber] + 1 : 1;
        cells.push({
          seat_number: cellReference,
          position: { x: col, y: row },
          location: fields.location,
          group: groupNumber
        });
      }
    }

    try {
      await MasallahGroup.deleteMany({ location: fields.location });
      const masallahGroups = Object.keys(groups).map(value => ({
        group_number: Number(value),
        location: fields.location,
        total_count: groups[value]
      }));
      await MasallahGroup.insertMany(masallahGroups);
    } catch (databaseError) {
      return response.status(500).send(databaseError.message);
    }

    try {
      const databaseGroups = await MasallahGroup.find({
        location: fields.location
      });
      let groupIdObject = {};
      databaseGroups.map(value => {
        groupIdObject[value.group_number.toString()] = value._id;
      });
      const databaseCells = cells.map(value => ({
        ...value,
        group: groupIdObject[value.group.toString()]
      }));
      await Masallah.deleteMany({ location: fields.location });
      await RamzanMemberV3.updateMany(
        { "d1.location": fields.location },
        {
          d1: {
            location: "",
            masallah: ""
          }
        }
      );
      await RamzanMemberV3.updateMany(
        { "d2.location": fields.location },
        {
          d2: {
            location: "",
            masallah: ""
          }
        }
      );
      await RamzanMemberV3.updateMany(
        { "d3.location": fields.location },
        {
          d3: {
            location: "",
            masallah: ""
          }
        }
      );
      await Masallah.insertMany(databaseCells);
      return response.status(200).send("Masallah added successfully");
    } catch (databaseError) {
      return response.status(500).send(databaseError.message);
    }
  });
};

export const getMasallahByLocation = async (request, response) => {
  const { location } = request.query;
  if (!location) return response.status(404).send("location missing!");

  try {
    let seats = await Masallah.find({ location }).populate([
      {
        path: "group",
        model: "MasallahGroup"
      },
      {
        path: "d1",
        model: "RamzanMemberV3",
        populate: [
          {
            path: "hof_id",
            model: "File"
          },
          {
            path: "member_details",
            model: "Member"
          }
        ]
      },
      {
        path: "d2",
        model: "RamzanMemberV3"
      },
      {
        path: "d3",
        model: "RamzanMemberV3"
      }
    ]);
    return response.status(200).send({ data: seats });
  } catch (databaseError) {
    return response.status(500).send(databaseError.message);
  }
};
