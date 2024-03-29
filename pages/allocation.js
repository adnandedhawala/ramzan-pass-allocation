/* eslint-disable security/detect-object-injection */
import { Button, message, Tabs } from "antd";
import { PAGE_LIST, SEAT_LOCATIONS, USER_ROLES } from "appConstants";
import {
  AllocationLocationRadioGroup,
  SeatNumberGrid,
  SeatNumberTable,
  SeatSummaryCard
} from "components";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { useMasallahContext } from "context/masallah";
import {
  allocateMemberToMasallahHelper,
  allocatePassesHelper,
  getMasallahByLocationHelper,
  getMasallahByLocationWithUserDataHelper
} from "fe";

import { Mainlayout } from "layouts/main";
import { useEffect, useMemo, useState } from "react";

export default function Allocation() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { changeSelectedSidebarKey, toggleLoader } = useGlobalContext();
  const {
    setCurrentLocation,
    currentLocation,
    currentDaska,
    setCurrentDaska,
    setMasallahList,
    masallahList,
    masallahListWithUser,
    setMasallahListWithUser
  } = useMasallahContext();

  const [tableView, setTableView] = useState("seat_list");

  useEffect(() => {
    changeSelectedSidebarKey(PAGE_LIST.ALLOCATION);
    setCurrentLocation(SEAT_LOCATIONS.MASJID);
    setCurrentDaska("d1");
    setPageTitle("Allocation Page");
    return () => {
      resetPage();
    };
  }, []);

  useEffect(() => {
    if (currentDaska !== "" && currentLocation !== "") {
      getMasallahByLocationWithUserDataHelper({
        location: currentLocation,
        successFn: data => {
          setMasallahListWithUser(data.data);
        },
        errorFn: () => {},
        endFn: () => {}
      });
    }
  }, [currentDaska, currentLocation, tableView]);

  const handleLocationChange = event => {
    const newLocation = event.target.value;
    if (newLocation === SEAT_LOCATIONS.MASJID) setCurrentDaska("d1");
    setCurrentLocation(newLocation);
    setTableView("seat_list");
  };

  const getDuplicateEntries = data => {
    const array = data
      .map(value => value[currentDaska])
      .filter(value => value !== "");
    const uniqueSet = new Set(array);
    return array.filter(currentValue => {
      if (uniqueSet.has(currentValue)) {
        uniqueSet.delete(currentValue);
      } else {
        return currentValue;
      }
    });
  };

  const getInvalidEntries = data => {
    const array = data
      .map(value => value[currentDaska])
      .filter(value => value !== "")
      .filter(value => !/^\d{8}$/.test(value));
    const uniqueSet = new Set(array);
    return [...uniqueSet];
  };

  const getMasallahList = location => {
    toggleLoader(true);
    getMasallahByLocationHelper({
      location,
      successFn: data => {
        const duplicateEntries = getDuplicateEntries(data.data);
        const invalidEntries = getInvalidEntries(data.data);
        setMasallahList(
          data.data.map(value => ({
            ...value.group,
            ...value,
            has_error:
              duplicateEntries.includes(value[currentDaska]) ||
              invalidEntries.includes(value[currentDaska])
          }))
        );
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
    getMasallahByLocationWithUserDataHelper({
      location: currentLocation,
      successFn: data => {
        setMasallahListWithUser(data.data);
      },
      errorFn: () => {},
      endFn: () => {}
    });
  };

  const handleSaveChangetoMasallah = () => {
    toggleLoader(true);
    allocateMemberToMasallahHelper({
      successFn: () => {
        message.success("Grid updated successfully");
        getMasallahList(currentLocation);
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
      data: {
        location: currentLocation,
        daska: currentDaska,
        data: masallahList.map(value => ({
          _id: value._id,
          [currentDaska]: value[currentDaska]
        }))
      }
    });
  };

  const handleAllocatePasses = () => {
    toggleLoader(true);
    allocatePassesHelper({
      successFn: () => {
        message.success("Passes are allocated successfully");
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
      location: currentLocation,
      daska: currentDaska
    });
  };

  const tabsComponent = useMemo(
    () => (
      <Tabs
        defaultActiveKey={tableView}
        onChange={key => setTableView(key)}
        size="small"
        type="card"
        tabBarExtraContent={{
          right: (
            <div className="flex mb-2 items-center">
              <Button
                disabled={tableView !== "seat_list"}
                size="middle"
                type="primary"
                onClick={handleSaveChangetoMasallah}
              >
                Save Grid
              </Button>
              <Button
                disabled={tableView !== "seat_list"}
                size="middle"
                onClick={handleAllocatePasses}
                className="ml-4"
              >
                Allocate Passes
              </Button>
            </div>
          )
        }}
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
            children: <SeatNumberTable rowData={masallahListWithUser} />
          },
          {
            label: "Summary",
            key: "seat_summary",
            children: (
              <SeatSummaryCard
                daska={currentDaska}
                rowData={masallahListWithUser}
              />
            )
          }
        ]}
      />
    ),
    [currentLocation, currentDaska, masallahList, tableView]
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

Allocation.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.Admin] } // will be passed to the page component as props
  };
}
