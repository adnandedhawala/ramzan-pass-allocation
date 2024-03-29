/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/prevent-abbreviations */
import React, { useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import moment from "moment";

export const RegisteredGrid = ({ data }) => {
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
    { field: "masjid", headerName: "Masjid", minWidth: 150 },
    {
      field: "d1",
      headerName: "Daska 1",
      minWidth: 125
    },
    {
      field: "d2",
      headerName: "Daska 2",
      minWidth: 125
    },
    {
      field: "d3",
      headerName: "Daska 3",
      minWidth: 125
    },
    {
      field: "is_rahat",
      headerName: "Rahat",
      minWidth: 125
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      minWidth: 250,
      cellRenderer: ({ value }) => (
        <span>
          {moment.utc(value).local().format("DD-MM-YYYY / hh:mm:ss A")}
        </span>
      )
    }
  ];
  const defaultColDef = useMemo(() => {
    return {
      editable: false,
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
          rowSelection={"multiple"}
          suppressScrollOnNewData={true}
        ></AgGridReact>
      </div>
    </div>
  );
};
