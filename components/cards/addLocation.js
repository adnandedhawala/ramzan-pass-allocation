import { Button, Card, message, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { SEAT_LOCATIONS } from "appConstants";

export const AddLocationCard = ({ handleSubmit }) => {
  const [excelFile, setexcelFile] = useState(null);
  const [location, setLocation] = useState(null);

  const loaderProperties = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action: "/api/noop",
    accept:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onChange(info) {
      if (info.file.status !== "uploading") {
        setexcelFile(info.file);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };

  const handleUploadGrid = () => {
    const formData = new FormData();
    // @ts-ignore: Object is possibly 'null'.
    formData.append("file", excelFile.originFileObj);
    formData.append("location", location);

    handleSubmit(formData);
  };

  return (
    <Card title="Add location">
      <div className="flex flex-col items-start">
        <Upload {...loaderProperties}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <Select
          className="w-full my-4"
          placeholder="select location"
          onChange={value => setLocation(value)}
          options={Object.values(SEAT_LOCATIONS).map(value => ({
            value,
            label: value
          }))}
        />
        <Button onClick={handleUploadGrid} disabled={!location || !excelFile}>
          Upload Grid
        </Button>
      </div>
    </Card>
  );
};
