/* eslint-disable security/detect-object-injection */
import { Divider, Table } from "antd";
import { groupBy, isNull } from "lodash";
import { useState } from "react";

const getData = (data, daska) => {
  const groupedData = groupBy(
    data
      .map(value => ({ ...value.group, ...value }))
      .filter(value => value.is_blocked === false),
    "group_number"
  );

  return Object.keys(groupedData).map(value => {
    let groupData = groupedData[value];
    let groupDetails = groupData[0];
    return {
      group_number: groupDetails.group_number,
      color: groupDetails.color,
      name: groupDetails.name,
      location: groupDetails.location,
      total_count: groupDetails.total_count,
      pending_count: groupData.filter(value => isNull(value[daska])).length
    };
  });
};

export const SeatSummaryCard = ({ rowData, daska }) => {
  const [pendingCount, setPendingCount] = useState(0);

  const groupColumns = [
    {
      title: "Group Number",
      dataIndex: "group_number",
      key: "group_number",
      width: 25,
      sorter: (a, b) => a.group_number - b.group_number,
      editable: false
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 50
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 50,
      editable: false
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: 50,
      editable: true,
      render: data => (
        <div
          style={{ backgroundColor: data }}
          className="w-4 h-4 m-auto border border-black border-solid "
        ></div>
      )
    },
    {
      title: "Total Seats",
      dataIndex: "total_count",
      key: "total_count",
      width: 25,
      editable: false,
      sorter: (a, b) => a.total_count - b.total_count
    },
    {
      title: "Pending Seats",
      dataIndex: "pending_count",
      key: "pending_count",
      width: 25,
      editable: false,
      sorter: (a, b) => a.total_count - b.total_count
    }
  ];

  const seatColumns = [
    {
      title: "Seat Number",
      dataIndex: "seat_number",
      key: "seat_number",
      width: 25,
      sorter: (x, y) => {
        // Extract the letter (first character)
        const letterX = x.seat_number.charAt(0);
        const letterY = y.seat_number.charAt(0);

        // If letters differ, sort based on letters
        if (letterX !== letterY) {
          return letterX.localeCompare(letterY);
        }

        // If letters are the same, extract the numeric part and compare as numbers
        const numberX = Number.parseInt(x.seat_number.slice(1), 10);
        const numberY = Number.parseInt(y.seat_number.slice(1), 10);

        return numberX - numberY; // ascending order
      },
      editable: false
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 50
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: 50,
      editable: true,
      render: data => (
        <div
          style={{ backgroundColor: data }}
          className="w-4 h-4 m-auto border border-black border-solid "
        ></div>
      )
    }
  ];

  useState(() => {
    const count = getData(rowData, daska)
      .map(value => value.pending_count)
      .reduce((sum, value) => sum + value, 0);
    setPendingCount(count);
  }, [rowData]);

  return (
    <>
      <h4 className="text-right text-lg font-light mb-4">
        {"Pending seats : " + pendingCount}
      </h4>
      <Table
        size="small"
        pagination={false}
        dataSource={getData(rowData, daska)}
        columns={groupColumns}
      />
      <Divider />
      <h2 className="mb-4">Pending seats</h2>
      <Table
        size="small"
        pagination={false}
        dataSource={rowData
          .map(value => ({ ...value.group, ...value }))
          .filter(value => value.is_blocked === false)
          .filter(value => isNull(value[daska]))}
        columns={seatColumns}
        scroll={{ y: 600 }}
      />
    </>
  );
};
