import { Button, Card, message, Row, Col } from "antd";
import { USER_ROLES } from "appConstants";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import {
  createGridDataFromExcelHelper,
  createRamzanMembersHelper,
  editMasallahGroupHelper,
  getMasallahGroupsHelper
} from "fe";
import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";
import { AddLocationCard, MasallahGroupCard } from "components";

export default function Settings() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { toggleLoader } = useGlobalContext();

  const [masllahGroupData, setMasllahGroupData] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

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

  const uploadGrid = formData => {
    toggleLoader(true);
    createGridDataFromExcelHelper({
      formData,
      successFn: () => {
        message.success("Grid Data added Successfully");
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
  };

  const getMasallahGroupsForTable = () => {
    setIsTableLoading(true);
    getMasallahGroupsHelper({
      successFn: data => {
        setMasllahGroupData(data.data);
      },
      errorFn: () => {},
      endFn: () => {
        setIsTableLoading(false);
      }
    });
  };

  const editMasallahGroupTableRow = (values, editingId, onSucess) => {
    editMasallahGroupHelper({
      groupId: editingId,
      values,
      successFn: () => {
        onSucess();
        getMasallahGroupsForTable();
      },
      errorFn: () => {},
      endFn: () => {}
    });
  };

  useEffect(() => {
    setPageTitle("Settings Page");
    getMasallahGroupsForTable();
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={8}>
          <Card title="Settings Buttons">
            <Button onClick={handleSetRamzanMembers} type="primary">
              Set Ramzan Members
            </Button>
          </Card>
        </Col>
        <Col xs={8}>
          <AddLocationCard handleSubmit={uploadGrid} />
        </Col>
      </Row>
      <Row className="mt-6" gutter={[24, 24]}>
        <Col xs={24}>
          <MasallahGroupCard
            handleSaveRow={editMasallahGroupTableRow}
            loading={isTableLoading}
            groupData={masllahGroupData}
          />
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
