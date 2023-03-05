import { Button, Card, message, Row, Col, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { USER_ROLES, SEAT_LOCATIONS } from "appConstants";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { createGridDataFromExcelHelper, createRamzanMembersHelper } from "fe";
import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";

export default function Settings() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { toggleLoader } = useGlobalContext();

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

  const handleSetRamzanMembers = () => {
    toggleLoader(true);
    createRamzanMembersHelper({
      successFn: () => {
        message.success("Member list updated successfully");
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
  };

  const handleUploadGrid = () => {
    const formData = new FormData();
    // @ts-ignore: Object is possibly 'null'.
    formData.append("file", excelFile.originFileObj);
    formData.append("location", location);

    createGridDataFromExcelHelper({
      formData,
      successFn: () => {
        message.success("Grid Data added Successfully");
      },
      errorFn: () => {},
      endFn: () => {}
    });
  };

  useEffect(() => {
    setPageTitle("Settings Page");
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={12}>
          <Card>
            <Button onClick={handleSetRamzanMembers} type="primary">
              Set Ramzan Members
            </Button>
          </Card>
        </Col>
        <Col xs={12}>
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
              <Button
                onClick={handleUploadGrid}
                disabled={!location || !excelFile}
              >
                Upload Grid
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

Settings.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.Admin] } // will be passed to the page component as props
  };
}
