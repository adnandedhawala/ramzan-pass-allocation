/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/prevent-abbreviations */
import React, { useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { findIndex } from "lodash";

export const AllocatedGrid = ({ data, setData }) => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "600px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const columnDefs = [
    { field: "_id", headerName: "ITS", flex: 2, minWidth: 100 },
    { field: "hof_id", headerName: "HOF ITS", flex: 2, minWidth: 120 },
    {
      field: "tanzeem_file_no",
      headerName: "File",
      minWidth: 100
    },
    { field: "hof_fm_type", headerName: "HOF/FM", minWidth: 100 },
    { field: "full_name", headerName: "Name", flex: 3, minWidth: 400 },
    { field: "first_prefix", headerName: "Prefix", minWidth: 100 },
    { field: "gender", headerName: "Gender", minWidth: 100 },
    { field: "idara", headerName: "Idara", flex: 2, minWidth: 100 },
    { field: "age", headerName: "Age", minWidth: 100 },
    {
      field: "is_rahat",
      headerName: "Rahat",
      minWidth: 125
    },
    {
      field: "show_pass",
      headerName: "Show Pass",
      editable: true,
      minWidth: 125
    }
  ];
  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      resizable: false,
      filter: "agTextColumnFilter"
    };
  }, []);

  const processCellFromClipboard = useCallback(params => {
    return params.value;
  }, []);

  const processCellForClipboard = useCallback(params => {
    return params.value;
  }, []);

  const handleCellValueChange = event => {
    const { newValue, data: currentData } = event;
    let gridData = [...data];
    let finalValue = ["yes", "no"].includes(newValue.trim())
      ? newValue.trim()
      : "no";
    const index = findIndex(gridData, { _id: currentData._id });
    // eslint-disable-next-line security/detect-object-injection
    gridData[index].show_pass = finalValue;
    setData(gridData);
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          copyHeadersToClipboard={false}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          processCellFromClipboard={processCellFromClipboard}
          processCellForClipboard={processCellForClipboard}
          onCellValueChanged={handleCellValueChange}
          rowSelection={"multiple"}
          suppressScrollOnNewData={true}
        ></AgGridReact>
      </div>
    </div>
  );
};
