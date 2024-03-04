import { Button, Radio, message } from "antd";
import { SEAT_LOCATIONS } from "appConstants";
import { SeatSummaryCard } from "components/cards";
import { SeatNumberGridV2 } from "components/grids";
import { SeatNumberTableV2 } from "components/tables";
import { useGlobalContext } from "context/global";
import {
  allocateMemberToMasallahByIdHelper,
  allocateMemberToMasallahHelper,
  allocatePassesHelper,
  getMasallahByLocationHelper,
  getMasallahByLocationWithUserDataHelper
} from "fe";
import { useState } from "react";

const views = {
  LIST: "LIST",
  GRID: "GRID",
  SUMMARY: "SUMMARY"
};

const currentDaska = "d1";
const currentLocation = SEAT_LOCATIONS.MASJID;

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

export const MardoAllocation = () => {
  const [view, setView] = useState(views.LIST);
  const [masallahList, setMasallahList] = useState([]);
  const [masallahListWithUser, setMasallahListWithUser] = useState([]);

  const { toggleLoader } = useGlobalContext();

  const getMasallahList = () => {
    toggleLoader(true);
    getMasallahByLocationHelper({
      location: currentLocation,
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

  const setMasallahUser = (values, id, callback) => {
    toggleLoader(true);
    allocateMemberToMasallahByIdHelper({
      successFn: () => {
        message.success("Masallah updated successfully");
        callback();
        getMasallahList();
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
      data: {
        data: {
          _id: id,
          d1: values?.d1 || "",
          d2: values?.d1 || "",
          d3: values?.d1 || ""
        }
      }
    });
  };

  const handleSaveChangetoMasallah = () => {
    toggleLoader(true);
    allocateMemberToMasallahHelper({
      successFn: () => {
        message.success("Grid updated successfully");
        getMasallahList();
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
      data: {
        location: currentLocation,
        data: masallahList.map(value => ({
          _id: value._id,
          d1: value?.d1 || "",
          d2: value?.d1 || "",
          d3: value?.d1 || ""
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
      location: currentLocation
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Radio.Group
          optionType="button"
          value={view}
          onChange={event => setView(event.target.value)}
          className="mb-4"
        >
          <Radio.Button value={views.LIST}>List</Radio.Button>
          <Radio.Button value={views.GRID}>Grid</Radio.Button>
          <Radio.Button value={views.SUMMARY}>Summary</Radio.Button>
        </Radio.Group>
        {view === views.LIST ? (
          <div className="flex mb-2 items-center">
            <Button
              size="middle"
              type="primary"
              onClick={handleSaveChangetoMasallah}
            >
              Save Grid
            </Button>
            <Button
              size="middle"
              onClick={handleAllocatePasses}
              className="ml-4"
            >
              Allocate Passes
            </Button>
          </div>
        ) : null}
      </div>
      {view === views.LIST ? (
        <SeatNumberGridV2
          getData={getMasallahList}
          rowData={masallahList}
          masallahListWithUser={masallahListWithUser}
          setData={setMasallahList}
          daska={currentDaska}
          currentDaska={currentDaska}
        />
      ) : null}
      {view === views.GRID ? (
        <SeatNumberTableV2
          masallahListWithUser={masallahListWithUser}
          currentLocation={currentLocation}
          setMasallahUser={setMasallahUser}
        />
      ) : null}
      {view === views.SUMMARY ? (
        <SeatSummaryCard daska={currentDaska} rowData={masallahListWithUser} />
      ) : null}
    </div>
  );
};
