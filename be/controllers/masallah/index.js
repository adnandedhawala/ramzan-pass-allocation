import formidable from "formidable";
import { Masallah, RamzanMember } from "models";
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
    const cells = [];
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellReference = XLSX.utils.encode_cell({ r: col, c: row });
        cells.push({
          seat_number: cellReference,
          position: { x: col, y: row },
          location: fields.location,
          group_number: jsonData[row][col]
        });
      }
    }

    try {
      await Masallah.deleteMany({ location: fields.location });
      await RamzanMember.updateMany(
        {},
        { allocation: { d1: "", d2: "", d3: "" } }
      );
      await Masallah.insertMany(cells);
      return response.status(200).send("Masallah added successfully");
    } catch (databaseError) {
      return response.status(500).send(databaseError.message);
    }
  });
};
