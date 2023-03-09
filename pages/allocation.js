import { Tabs } from "antd";
import { PAGE_LIST, SEAT_LOCATIONS, USER_ROLES } from "appConstants";
import { AllocationLocationRadioGroup, SeatNumberGrid } from "components";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { useMasallahContext } from "context/masallah";
import { getMasallahByLocationHelper } from "fe";

import { Mainlayout } from "layouts/main";
import { useEffect, useMemo } from "react";

export default function Settings() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { changeSelectedSidebarKey } = useGlobalContext();
  const {
    setCurrentLocation,
    currentLocation,
    currentDaska,
    setCurrentDaska,
    setMasallahList,
    masallahList
  } = useMasallahContext();

  useEffect(() => {
    changeSelectedSidebarKey(PAGE_LIST.ALLOCATION);
    setCurrentLocation(SEAT_LOCATIONS.MASJID);
    setCurrentDaska("d1");
    setPageTitle("Allocation Page");
    return () => {
      resetPage();
    };
  }, []);

  const handleLocationChange = event => {
    const newLocation = event.target.value;
    if (newLocation === SEAT_LOCATIONS.MASJID) setCurrentDaska("d1");
    setCurrentLocation(newLocation);
  };

  const getMasallahList = location => {
    getMasallahByLocationHelper({
      location,
      successFn: data => {
        setMasallahList(data.data.map(value => ({ ...value.group, ...value })));
      },
      errorFn: () => {},
      endFn: () => {}
    });
  };

  const tabsComponent = useMemo(
    () => (
      <Tabs
        defaultActiveKey={"seat_list"}
        size="small"
        type="card"
        items={[
          {
            label: "List",
            key: "seat_list",
            children: (
              <SeatNumberGrid
                getData={getMasallahList}
                location={currentLocation}
                rowData={masallahList}
                setData={setMasallahList}
                daska={currentDaska}
              />
            )
          },
          {
            label: "Grid",
            key: "seat_grid",
            children: (
              <SeatNumberGrid
                getData={getMasallahList}
                location={currentLocation}
                rowData={masallahList}
              />
            )
          }
        ]}
      />
    ),
    [currentLocation, currentDaska, masallahList]
  );

  return (
    <>
      <AllocationLocationRadioGroup
        handleChange={handleLocationChange}
        value={currentLocation}
      />
      {currentLocation === SEAT_LOCATIONS.MASJID ? tabsComponent : null}
      {currentLocation === SEAT_LOCATIONS.FIRST_FLOOR ? (
        <Tabs
          defaultActiveKey={currentDaska}
          size="small"
          type="card"
          centered
          onChange={key => setCurrentDaska(key)}
          items={[
            {
              label: "Daska 1",
              key: "d1",
              children: tabsComponent
            },
            {
              label: "Daska 2",
              key: "d2",
              children: tabsComponent
            },
            {
              label: "Daska 3",
              key: "d3",
              children: tabsComponent
            }
          ]}
        />
      ) : null}
      {currentLocation === SEAT_LOCATIONS.SECOND_FLOOR ? (
        <Tabs
          defaultActiveKey={currentDaska}
          size="small"
          centered
          type="card"
          onChange={key => setCurrentDaska(key)}
          items={[
            {
              label: "Daska 1",
              key: "d1",
              children: tabsComponent
            },
            {
              label: "Daska 2",
              key: "d2",
              children: tabsComponent
            },
            {
              label: "Daska 3",
              key: "d3",
              children: tabsComponent
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
