/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/prevent-abbreviations */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { find, findIndex } from "lodash";

const getRowStyle = params => {
  return { background: params.data.color };
};

export const SeatNumberGridV2 = ({
  rowData,
  getData,
  setData,
  daska,
  masallahListWithUser,
  currentDaska
}) => {
  const [tableData, setTableData] = useState([]);

  const containerStyle = useMemo(
    () => ({ width: "100%", height: "600px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const columnDefs = [
    {
      field: "seat_number",
      headerName: "Seat",
      editable: false,
      sortable: true
    },
    { field: "name", headerName: "Group", editable: false, sortable: true },
    { field: "location", editable: false },
    {
      field: "is_blocked",
      headerName: "Blocked",
      editable: false,
      valueFormatter: params => (params.value ? "yes" : "no")
    },
    {
      field: daska,
      cellStyle: params => {
        if (params.data.has_error) {
          return { border: "1px solid red" };
        }
        return null;
      }
    },
    {
      field: "allocated_name",
      headerName: "Name",
      editable: false,
      flex: 3
    }
  ];
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
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

  const onGridReady = () => {
    getData();
  };

  const handleCellValueChange = event => {
    const { newValue, data } = event;
    let gridData = [...rowData];
    const index = findIndex(gridData, { _id: data._id });
    // eslint-disable-next-line security/detect-object-injection
    gridData[index][daska] = newValue;
    setData(gridData);
  };

  useEffect(() => {
    setTableData(
      rowData.map(value => {
        const masallahData = find(masallahListWithUser, { _id: value._id });
        const allocated_name =
          masallahData && masallahData[currentDaska]
            ? masallahData[currentDaska].member_details?.full_name
            : "";
        return {
          ...value,
          allocated_name
        };
      })
    );
  }, [rowData, masallahListWithUser]);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={tableData}
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
          suppressScrollOnNewData={true}
        ></AgGridReact>
      </div>
    </div>
  );
};
