import { Tabs } from "antd";
import { PAGE_LIST, SEAT_LOCATIONS, USER_ROLES } from "appConstants";
import { AllocationLocationRadioGroup } from "components";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { useMasallahContext } from "context/masallah";

import { Mainlayout } from "layouts/main";
import { useEffect } from "react";

export default function Settings() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { changeSelectedSidebarKey } = useGlobalContext();
  const { setCurrentLocation, currentLocation, currentDaska, setCurrentDaska } =
    useMasallahContext();

  useEffect(() => {
    changeSelectedSidebarKey(PAGE_LIST.ALLOCATION);
    setCurrentLocation(SEAT_LOCATIONS.MASJID);
    setCurrentDaska("d1");
    setPageTitle("Allocation Page");
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <AllocationLocationRadioGroup
        handleChange={event => setCurrentLocation(event.target.value)}
        value={currentLocation}
      />
      {currentLocation === SEAT_LOCATIONS.MASJID ? <div>Masjid</div> : null}
      {currentLocation === SEAT_LOCATIONS.FIRST_FLOOR ? (
        <Tabs
          defaultActiveKey={currentDaska}
          size="small"
          centered
          onChange={key => setCurrentDaska(key)}
          items={[
            {
              label: "Daska 1",
              key: "d1",
              children: <div>D1</div>
            },
            {
              label: "Daska 2",
              key: "d2",
              children: <div>D2</div>
            },
            {
              label: "Daska 3",
              key: "d3",
              children: <div>D3</div>
            }
          ]}
        />
      ) : null}
      {currentLocation === SEAT_LOCATIONS.SECOND_FLOOR ? (
        <Tabs
          defaultActiveKey={currentDaska}
          size="small"
          centered
          onChange={key => setCurrentDaska(key)}
          items={[
            {
              label: "Daska 1",
              key: "d1",
              children: <div>D1</div>
            },
            {
              label: "Daska 2",
              key: "d2",
              children: <div>D2</div>
            },
            {
              label: "Daska 3",
              key: "d3",
              children: <div>D3</div>
            }
          ]}
        />
      ) : null}
    </>
  );
}

Settings.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.Admin] } // will be passed to the page component as props
  };
}
