/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable security/detect-object-injection */
import formidable from "formidable";
import { Masallah, MasallahGroup, RamzanMember } from "models";
import moment from "moment";
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
        let colDisplayNumber = col + 1;
        const colNumber =
          colDisplayNumber < 10
            ? "0" + colDisplayNumber.toString()
            : colDisplayNumber.toString();
        const groupNumber = jsonData[row][col];
        groups[groupNumber] = groups[groupNumber] ? groups[groupNumber] + 1 : 1;
        cells.push({
          seat_number:
            String.fromCodePoint("A".codePointAt(0) + row) + colNumber,
          position: { x: col, y: row },
          location: fields.location,
          is_blocked: false,
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
      await RamzanMember.updateMany(
        { "d1.location": fields.location },
        {
          d1: {
            location: "",
            masallah: ""
          }
        }
      );
      await RamzanMember.updateMany(
        { "d2.location": fields.location },
        {
          d2: {
            location: "",
            masallah: ""
          }
        }
      );
      await RamzanMember.updateMany(
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
  const { location, showMemberData } = request.query;
  if (!location) return response.status(404).send("location missing!");
  const queryLocation = location.split(",");
  const daskaPopulationQuery = [
    {
      path: "hof_id",
      select: "_id tanzeem_file_no",
      model: "File"
    },
    {
      path: "member_details",
      select: "_id full_name gender hof_fm_type",
      model: "Member"
    }
  ];
  try {
    let populateQuery = [
      {
        path: "group",
        model: "MasallahGroup"
      }
    ];
    if (showMemberData === "yes") {
      populateQuery = [
        ...populateQuery,
        {
          path: "d1",
          model: "RamzanMember",
          populate: daskaPopulationQuery
        },
        {
          path: "d2",
          model: "RamzanMember",
          populate: daskaPopulationQuery
        },
        {
          path: "d3",
          model: "RamzanMember",
          populate: daskaPopulationQuery
        }
      ];
    }
    let seats = await Masallah.find({
      location: { $in: queryLocation }
    }).populate(populateQuery);
    const availableSeats = seats.sort(
      (a, b) => a.group.group_number - b.group.group_number
    );
    return response.status(200).send({ data: availableSeats });
  } catch (databaseError) {
    return response.status(500).send(databaseError.message);
  }
};

export const getMasallahById = async (request, response) => {
  const { masallahId } = request.query;
  if (!masallahId) return response.status(404).send("masallahId missing!");
  try {
    let seat = await Masallah.findById(masallahId).populate([
      {
        path: "d1",
        model: "RamzanMember",
        select: "member_details",
        populate: [
          {
            path: "member_details",
            select: "_id full_name gender hof_fm_type",
            model: "Member"
          }
        ]
      },
      {
        path: "d2",
        model: "RamzanMember",
        select: "member_details",
        populate: [
          {
            path: "member_details",
            select: "_id full_name gender hof_fm_type",
            model: "Member"
          }
        ]
      },
      {
        path: "d3",
        model: "RamzanMember",
        select: "member_details",
        populate: [
          {
            path: "member_details",
            select: "_id full_name gender hof_fm_type",
            model: "Member"
          }
        ]
      }
    ]);
    const memberId = seat?.d1?._id;
    if (memberId) {
      await RamzanMember.findByIdAndUpdate(memberId, {
        has_seen_pass: true,
        has_seen_pass_date: moment(new Date())
      });
    }
    return response.status(200).send({ data: seat, memberId });
  } catch (databaseError) {
    return response.status(500).send(databaseError.message);
  }
};
