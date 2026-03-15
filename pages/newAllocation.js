import { Radio } from "antd";
import { PAGE_LIST, SEAT_LOCATIONS, USER_ROLES } from "appConstants";
import { BairaoAllocation, MardoAllocation } from "components/allocation";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";

const allocationMode = {
  MARDO: "MARDO",
  BAIRAO: "BAIRAO",
  D_MARDO: "D_MARDO",
  D_BAIRAO: "D_BAIRAO"
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
        <Radio.Button value={allocationMode.D_MARDO}>Draft Mardo</Radio.Button>
        <Radio.Button value={allocationMode.D_BAIRAO}>
          Draft Bairao
        </Radio.Button>
      </Radio.Group>
      {currentAllocationMode === allocationMode.MARDO ? (
        <MardoAllocation currentLocation={SEAT_LOCATIONS.MASJID} />
      ) : null}
      {currentAllocationMode === allocationMode.BAIRAO ? (
        <BairaoAllocation
          currentLocation={
            SEAT_LOCATIONS.FIRST_FLOOR + "," + SEAT_LOCATIONS.SECOND_FLOOR
          }
        />
      ) : null}
      {currentAllocationMode === allocationMode.D_MARDO ? (
        <MardoAllocation currentLocation={SEAT_LOCATIONS.D_MASJID} />
      ) : null}
      {currentAllocationMode === allocationMode.D_BAIRAO ? (
        <BairaoAllocation
          currentLocation={
            SEAT_LOCATIONS.D_FIRST_FLOOR + "," + SEAT_LOCATIONS.D_SECOND_FLOOR
          }
        />
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
