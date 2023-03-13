/* eslint-disable security/detect-object-injection */
import { Divider, Table } from "antd";
import { groupBy, isNull } from "lodash";
import { useState } from "react";

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

  const getData = () => {
    const groupedData = groupBy(
      rowData
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

  useState(() => {
    const count = getData()
      .map(value => value.pending_count)
      .reduce((sum, value) => sum + value, 0);
    setPendingCount(count);
  }, []);

  return (
    <>
      <h4 className="text-right text-lg font-light mb-4">
        {"Pending seats : " + pendingCount}
      </h4>
      <Table
        size="small"
        pagination={false}
        dataSource={getData()}
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
