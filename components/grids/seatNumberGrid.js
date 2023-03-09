/* eslint-disable unicorn/prevent-abbreviations */
import React, { useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const getRowStyle = params => {
  return { background: params.data.color };
};

export const SeatNumberGrid = ({
  location,
  rowData,
  getData,
  setData,
  daska
}) => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "600px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const columnDefs = [
    { field: "name", headerName: "Group", editable: false },
    { field: "seat_number", headerName: "Seat", editable: false },
    { field: "location", editable: false },
    {
      field: "is_blocked",
      headerName: "Blocked",
      editable: false,
      valueFormatter: params => (params.value ? "yes" : "no")
    },
    { field: daska }
  ];
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      resizable: false
    };
  }, []);

  const processCellFromClipboard = useCallback(params => {
    return params.value;
  }, []);

  const processCellForClipboard = useCallback(params => {
    return params.value;
  }, []);

  const onGridReady = () => {
    getData(location);
  };

  const handleCellValueChange = event => {
    const { newValue, rowIndex } = event;
    let gridData = [...rowData];

    // eslint-disable-next-line security/detect-object-injection
    gridData[rowIndex][daska] = newValue;
    setData(gridData);
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          copyHeadersToClipboard={false}
          getRowStyle={getRowStyle}
          onGridReady={onGridReady}
          undoRedoCellEditing={true}
          undoRedoCellEditingLimit={20}
          processCellFromClipboard={processCellFromClipboard}
          processCellForClipboard={processCellForClipboard}
          onCellValueChanged={handleCellValueChange}
          rowSelection={"multiple"}
        ></AgGridReact>
      </div>
    </div>
  );
};
