import { Button, Card, message, Row, Col, Radio, Popconfirm } from "antd";
import { PAGE_LIST, USER_ROLES } from "appConstants";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import {
  createGridDataFromExcelHelper,
  createRamzanMembersHelper,
  editMasallahGroupHelper,
  getMasallahGroupsHelper,
  resetMasallahAllocationsHelper,
  resetRamzanRegistrationHelper
} from "fe";
import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";
import { AddLocationCard, MasallahGroupCard } from "components";
import { editSettingsHelper, getSettingsHelper } from "fe/helpers/settings";

export default function Settings() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { toggleLoader, changeSelectedSidebarKey } = useGlobalContext();

  const [masllahGroupData, setMasllahGroupData] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isRegistrationOn, setIsRegistrationOn] = useState(false);

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

  const handleResetAllocation = () => {
    toggleLoader(true);
    resetMasallahAllocationsHelper({
      successFn: () => {
        message.success("Allocations are reset successfully");
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
  };

  const handleResetRegistration = () => {
    toggleLoader(true);
    resetRamzanRegistrationHelper({
      successFn: () => {
        message.success("Registrations are reset successfully");
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
        getMasallahGroupsForTable();
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

  const getSettingsForPage = () => {
    getSettingsHelper({
      successFn: data => {
        setIsRegistrationOn(data.data[0].is_registration_on);
      },
      errorFn: () => {},
      endFn: () => {}
    });
  };

  const editRegistration = flag => {
    toggleLoader(true);
    editSettingsHelper({
      successFn: () => {
        getSettingsForPage();
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
      settingsData: {
        _id: process.env.NEXT_PUBLIC_SETTINGS_KEY,
        is_registration_on: flag
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
    changeSelectedSidebarKey(PAGE_LIST.SETTINGS);
    setPageTitle("Settings Page");
    getMasallahGroupsForTable();
    getSettingsForPage();
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={8}>
          <Card title="Settings Buttons">
            <div className="flex flex-col">
              <Popconfirm
                title="Reset Data"
                description="Are you sure you want to reset data?"
                onConfirm={handleSetRamzanMembers}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: "primary", danger: true }}
              >
                <Button className="mb-3" danger>
                  Hard Reset Member Data
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Reset Registrations"
                description="Are you sure you want to reset registrations?"
                onConfirm={handleResetRegistration}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: "primary", danger: true }}
              >
                <Button className="mb-3" danger>
                  Reset Registrations
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Reset Allocations"
                description="Are you sure you want to Allocations?"
                onConfirm={handleResetAllocation}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ type: "primary", danger: true }}
              >
                <Button className="mb-3" danger>
                  Reset Allocations
                </Button>
              </Popconfirm>
            </div>
            <div className="mt-2">
              <p>Is Registration Open: </p>
              <Radio.Group
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" }
                ]}
                onChange={event =>
                  editRegistration(event.target.value === "yes")
                }
                value={isRegistrationOn ? "yes" : "no"}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
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
