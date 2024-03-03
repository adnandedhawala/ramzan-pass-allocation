import { Radio } from "antd";
import { PAGE_LIST, USER_ROLES } from "appConstants";
import { BairaoAllocation, MardoAllocation } from "components/allocation";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";

const allocationMode = {
  ZAHRA: "ZAHRA",
  MARDO: "MARDO",
  BAIRAO: "BAIRAO"
};

export default function NewAllocation() {
  const [currentAllocationMode, setCurrentAllocationMode] = useState(
    allocationMode.MARDO
  );
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { changeSelectedSidebarKey } = useGlobalContext();

  useEffect(() => {
    setPageTitle("Allocation Page");
    changeSelectedSidebarKey(PAGE_LIST.ALLOCATION);

    return () => {
      resetPage();
    };
  }, []);
  return (
    <>
      <Radio.Group
        optionType="button"
        buttonStyle="solid"
        value={currentAllocationMode}
        onChange={event => setCurrentAllocationMode(event.target.value)}
        className="mb-4"
      >
        <Radio.Button value={allocationMode.MARDO}>
          Saifee Masjid Mardo
        </Radio.Button>
        <Radio.Button value={allocationMode.BAIRAO}>
          Saifee Masjid Bairao
        </Radio.Button>
        <Radio.Button value={allocationMode.ZAHRA}>
          Masjid Al Zahra
        </Radio.Button>
      </Radio.Group>
      {currentAllocationMode === allocationMode.MARDO ? (
        <MardoAllocation />
      ) : null}
      {currentAllocationMode === allocationMode.BAIRAO ? (
        <BairaoAllocation />
      ) : null}
    </>
  );
}

NewAllocation.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.Admin] } // will be passed to the page component as props
  };
}
