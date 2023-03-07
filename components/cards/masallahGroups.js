import { Button, Card, Form, Input, message, Radio, Table } from "antd";
import { SEAT_LOCATIONS } from "appConstants";
import { useState } from "react";

const EditableCell = ({
  editing,
  dataIndex,
  inputType,
  children,
  ...restProperties
}) => {
  const inputNode =
    inputType === "boolean" ? (
      <Radio.Group>
        <Radio value="yes"> Yes </Radio>
        <Radio value="no"> No </Radio>
      </Radio.Group>
    ) : (
      <Input />
    );
  const ruleArray = [
    {
      required: false
    }
  ];
  if (dataIndex === "color") {
    ruleArray.push({
      pattern: /^#([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/,
      message: `invalid color code`
    });
  }
  return (
    <td {...restProperties}>
      {editing ? (
        <Form.Item name={dataIndex} className="mb-0" rules={ruleArray}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
export const MasallahGroupCard = ({ groupData, handleSaveRow, loading }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [editingId, setEditingId] = useState("");

  const isEditing = record => record.key === editingKey;
  const edit = record => {
    form.setFieldsValue({
      name: record.name,
      is_blocked: record.is_blocked ? "yes" : "no",
      color: record.color,
      _id: record._id
    });
    setEditingKey(record.key);
    setEditingId(record._id);
  };

  const cancel = () => {
    setEditingKey("");
    setEditingId("");
  };

  const save = async () => {
    try {
      await form.validateFields();
      form.submit();
    } catch {
      message.error("Invalid values!");
    }
  };

  const handleSubmit = values => {
    let submitValues = {
      ...values
    };
    if (submitValues.is_blocked) {
      submitValues.is_blocked =
        submitValues.is_blocked === "yes" ? true : false;
    }
    handleSaveRow(submitValues, editingId, () => {
      cancel();
    });
  };

  const columns = [
    {
      title: "Group Number",
      dataIndex: "group_number",
      key: "group_number",
      width: 25,
      editable: false
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 50,
      editable: true
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 50,
      editable: false,
      filters: Object.values(SEAT_LOCATIONS).map(value => ({
        text: value,
        value
      })),
      onFilter: (value, record) => record.location === value
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
      title: "Is Blocked",
      dataIndex: "is_blocked",
      key: "is_blocked",
      width: 25,
      editable: true,
      render: data => <div>{data ? "yes" : "no"}</div>
    },
    {
      title: "Total Count",
      dataIndex: "total_count",
      key: "total_count",
      width: 25,
      editable: false,
      sorter: (a, b) => a.total_count - b.total_count
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: 100,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button className="mr-2" onClick={() => save()} type="link">
              Save
            </Button>
            <Button onClick={cancel} type="text">
              Cancel
            </Button>
          </span>
        ) : (
          <Button
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
            type="link"
          >
            Edit
          </Button>
        );
      }
    }
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === "is_blocked" ? "boolean" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return (
    <Card title="Masallah Groups">
      <Form onFinish={handleSubmit} form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={groupData.map((value, index) => ({
            ...value,
            key: index
          }))}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
          loading={loading}
          scroll={{
            y: 500
          }}
          size="small"
        />
      </Form>
    </Card>
  );
};
