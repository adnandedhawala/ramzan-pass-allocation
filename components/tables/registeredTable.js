import { Table } from "antd";

const columns = [
  {
    title: "File",
    dataIndex: "tanzeem_file_no",
    key: "tanzeem_file_no",
    width: 50
  },
  {
    title: "ITS",
    dataIndex: "_id",
    key: "_id",
    width: 75
  },
  {
    title: "Name",
    dataIndex: "full_name",
    key: "full_name",
    width: 150
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    width: 50
  },
  {
    title: "Rahat Block",
    dataIndex: "is_rahat",
    key: "is_rahat",
    render: value => (value ? "yes" : "no"),
    width: 50
  },
  {
    title: "Daska 1",
    dataIndex: "d1",
    key: "d1",
    render: value => (value ? "yes" : "no"),
    width: 50
  },
  {
    title: "Daska 2",
    dataIndex: "d2",
    key: "d2",
    render: value => (value ? "yes" : "no"),
    width: 50
  },
  {
    title: "Daska 3",
    dataIndex: "d3",
    key: "d3",
    render: value => (value ? "yes" : "no"),
    width: 50
  }
];

export const RegisteredTable = ({ data }) => {
  return (
    <Table
      dataSource={data.map(value => ({ ...value, key: value._id }))}
      scroll={{ x: "max-content", y: "600px" }}
      columns={columns}
      pagination={false}
      size="small"
    />
  );
};
