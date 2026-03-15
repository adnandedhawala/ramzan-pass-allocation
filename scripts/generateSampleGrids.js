/* eslint-disable sonarjs/no-all-duplicated-branches */
/* eslint-disable no-console */
const XLSX = require("xlsx");
const path = require("node:path");

// The upload controller reads each cell as a group number.
// Rows map to letters (A, B, C...), columns to numbers (01, 02...).
// This generates a simple grid with group numbers.

function createGrid(rows, cols, groupPattern) {
  const data = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      // Assign group numbers based on the pattern callback
      row.push(groupPattern(r, c));
    }
    data.push(row);
  }
  return data;
}

function saveExcel(data, filename) {
  const ws = XLSX.utils.aoa_to_array
    ? XLSX.utils.aoa_to_sheet(data)
    : XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const filepath = path.join(__dirname, "..", "public", filename);
  XLSX.writeFile(wb, filepath);
  console.log(`Created: ${filepath}`);
}

// D_MASJID: 5 rows x 8 cols, 4 groups
saveExcel(
  createGrid(5, 8, r => Math.floor(r / 2) + 1),
  "sample_d_masjid.xlsx"
);

// D_FIRST_FLOOR: 4 rows x 6 cols, 3 groups
saveExcel(
  createGrid(4, 6, r => Math.floor(r / 2) + 1),
  "sample_d_first_floor.xlsx"
);

// D_SECOND_FLOOR: 3 rows x 6 cols, 2 groups
saveExcel(
  createGrid(3, 6, r => (r < 2 ? 1 : 2)),
  "sample_d_second_floor.xlsx"
);

console.log(
  "\nDone! Upload these files from the Settings page with the corresponding location selected."
);
